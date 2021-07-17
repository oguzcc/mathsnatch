const { validate } = require('../models/endchallenge/challengeend');
const { User } = require('../models/user/user');
const auth = require('../middleware/auth');
const _ = require('lodash');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const express = require('express');
const router = express.Router();

// Fawn.init(mongoose);

router.post('/', [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.user._id !== req.body.user_id)
    return res.status(401).send('Access denied');

  const user = await User.findById(req.body.user_id);
  if (!user) return res.status(400).send('Invalid user.');

  const bodyFC0 = req.body.finishedChallenges[0];
  const topicId = bodyFC0.topicId;
  const cardId = bodyFC0.cards[0].cardId;
  const subjects = bodyFC0.cards[0].subjects;

  let iofc;
  let iofc2;
  let iofc3;

  let totalCorrect = 0;
  let totalWrong = 0;

  for (const treasures of subjects) {
    totalCorrect = totalCorrect + treasures.correctInSubject;
    totalWrong = totalWrong + treasures.wrongInSubject;
  }

  const score = totalCorrect - totalWrong * 3;

  function updateTreasures() {
    user.points = _.round(user.points + score * 5);
    user.coins = _.round(user.coins + score / 4);
  }

  function updateTreasuresPlayed() {
    user.points = _.round(user.points + score);
    user.coins = _.round(user.coins + score / 12);
  }

  function accuracyPercentageUpdate() {
    user.finishedChallenges[iofc].cards[iofc2].subjects[
      iofc3
    ].accuracyPercentageInSubject = _.round(
      (user.finishedChallenges[iofc].cards[iofc2].subjects[iofc3]
        .correctInSubject /
        (user.finishedChallenges[iofc].cards[iofc2].subjects[iofc3]
          .correctInSubject +
          user.finishedChallenges[iofc].cards[iofc2].subjects[iofc3]
            .wrongInSubject)) *
        100,
      2
    );
  }

  iofc = _.findIndex(user.finishedChallenges, {
    topicId: topicId,
  });
  for (const element of subjects) {
    if (iofc != -1) {
      // topicId ye sahip obje mevcut
      iofc2 = _.findIndex(user.finishedChallenges[iofc].cards, {
        cardId: cardId,
      });
      if (iofc2 != -1) {
        // cardId ye sahip obje mevcut
        iofc3 = _.findIndex(
          user.finishedChallenges[iofc].cards[iofc2].subjects,
          {
            subjectId: element.subjectId,
          }
        );

        if (iofc3 != -1) {
          //subjectId ye sahip obje mevcut
          user.finishedChallenges[iofc].cards[iofc2].subjects[
            iofc3
          ].correctInSubject =
            user.finishedChallenges[iofc].cards[iofc2].subjects[iofc3]
              .correctInSubject + element.correctInSubject;
          user.finishedChallenges[iofc].cards[iofc2].subjects[
            iofc3
          ].wrongInSubject =
            user.finishedChallenges[iofc].cards[iofc2].subjects[iofc3]
              .wrongInSubject + element.wrongInSubject;
          updateTreasuresPlayed();
          accuracyPercentageUpdate();
        } else {
          // o subjectId ye sahip obje yok
          user.finishedChallenges[iofc].cards[iofc2].subjects.push(element);
          iofc3 = _.findIndex(
            user.finishedChallenges[iofc].cards[iofc2].subjects,
            {
              subjectId: element.subjectId,
            }
          );
          updateTreasures();
          accuracyPercentageUpdate();
        }
      } else {
        // o cardId ye sahip obje yok
        user.finishedChallenges[iofc].cards.push(bodyFC0.cards[0]);
        iofc2 = _.findIndex(user.finishedChallenges[iofc].cards, {
          cardId: cardId,
        });
        subjects.forEach((element2) => {
          iofc3 = _.findIndex(
            user.finishedChallenges[iofc].cards[iofc2].subjects,
            {
              subjectId: element2.subjectId,
            }
          );
          updateTreasures();
          accuracyPercentageUpdate();
        });
        break;
      }
    } else {
      // o topicId ye sahip obje yok
      user.finishedChallenges.push(bodyFC0);
      iofc = _.findIndex(user.finishedChallenges, {
        topicId: topicId,
      });
      iofc2 = _.findIndex(user.finishedChallenges[iofc].cards, {
        cardId: cardId,
      });

      subjects.forEach((element2) => {
        iofc3 = _.findIndex(
          user.finishedChallenges[iofc].cards[iofc2].subjects,
          {
            subjectId: element2.subjectId,
          }
        );
        updateTreasures();
        accuracyPercentageUpdate();
      });
      break;
    }
  }

  //user.coins = user.coins + parseInt(bodyCA) * 100;
  //user.level = user.level + user.coins / 1000;

  user.finishedChallenges.sort(function (a, b) {
    return a.topicId - b.topicId;
  });

  for (let i = 0; i < user.finishedChallenges.length; i++) {
    user.finishedChallenges[i].cards.sort(function (a, b) {
      return a.cardId - b.cardId;
    });
  }

  for (let i = 0; i < user.finishedChallenges.length; i++) {
    for (let j = 0; j < user.finishedChallenges[i].cards.length; j++) {
      user.finishedChallenges[i].cards[j].subjects.sort(function (a, b) {
        return a.subjectId - b.subjectId;
      });
    }
  }

  try {
    new Fawn.Task()
      .update(
        'users',
        { _id: user._id },
        {
          $set: {
            level: user.level,
            points: user.points,
            coins: user.coins,
            gems: user.gems,
            tickets: user.tickets,
            lastOnline: new Date(),
            finishedChallenges: user.finishedChallenges,
          },
        }
      )
      .run();

    res.send(_.pick(user, ['_id']));
  } catch (ex) {
    res.status(500).send('Something failed.');
  }
});

module.exports = router;
