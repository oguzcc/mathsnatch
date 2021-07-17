const { validate } = require('../models/endcard/cardend');
const { User } = require('../models/user/user');
const auth = require('../middleware/auth');
const _ = require('lodash');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const express = require('express');
const router = express.Router();

Fawn.init(mongoose);

router.post('/', [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.user._id !== req.body.user_id)
    return res.status(401).send('Access denied');

  const user = await User.findById(req.body.user_id);
  if (!user) return res.status(400).send('Invalid user.');

  const bodyFC0 = req.body.finishedCards[0];
  const bodylogCards = req.body.logCards;
  const topicId = bodyFC0.topicId;
  const cardId = bodyFC0.cards[0].cardId;
  const subjects = bodyFC0.cards[0].subjects;

  bodylogCards.forEach((element) => {
    user.logCards.push(element);
  });

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

  function updateAccuracyPercentage() {
    user.finishedCards[iofc].cards[iofc2].subjects[
      iofc3
    ].accuracyPercentageInSubject = _.round(
      (user.finishedCards[iofc].cards[iofc2].subjects[iofc3].correctInSubject /
        (user.finishedCards[iofc].cards[iofc2].subjects[iofc3]
          .correctInSubject +
          user.finishedCards[iofc].cards[iofc2].subjects[iofc3]
            .wrongInSubject)) *
        100,
      2
    );
  }

  iofc = _.findIndex(user.finishedCards, {
    topicId: topicId,
  });
  for (const element of subjects) {
    if (iofc != -1) {
      // topicId ye sahip obje mevcut
      iofc2 = _.findIndex(user.finishedCards[iofc].cards, {
        cardId: cardId,
      });
      if (iofc2 != -1) {
        // cardId ye sahip obje mevcut
        iofc3 = _.findIndex(user.finishedCards[iofc].cards[iofc2].subjects, {
          subjectId: element.subjectId,
        });

        if (iofc3 != -1) {
          //subjectId ye sahip obje mevcut
          user.finishedCards[iofc].cards[iofc2].subjects[
            iofc3
          ].correctInSubject =
            user.finishedCards[iofc].cards[iofc2].subjects[iofc3]
              .correctInSubject + element.correctInSubject;
          user.finishedCards[iofc].cards[iofc2].subjects[iofc3].wrongInSubject =
            user.finishedCards[iofc].cards[iofc2].subjects[iofc3]
              .wrongInSubject + element.wrongInSubject;

          updateTreasuresPlayed();
          updateAccuracyPercentage();
        } else {
          // o subjectId ye sahip obje yok
          user.finishedCards[iofc].cards[iofc2].subjects.push(element);
          iofc3 = _.findIndex(user.finishedCards[iofc].cards[iofc2].subjects, {
            subjectId: element.subjectId,
          });
          user.points = _.round(user.points + score * 10);
          user.coins = _.round(user.coins + score / 5);
          updateTreasures();
          updateAccuracyPercentage();
        }
      } else {
        // o cardId ye sahip obje yok
        user.finishedCards[iofc].cards.push(bodyFC0.cards[0]);
        iofc2 = _.findIndex(user.finishedCards[iofc].cards, {
          cardId: cardId,
        });
        subjects.forEach((element2) => {
          iofc3 = _.findIndex(user.finishedCards[iofc].cards[iofc2].subjects, {
            subjectId: element2.subjectId,
          });
          updateTreasures();
          updateAccuracyPercentage();
        });
        break;
      }
    } else {
      // o topicId ye sahip obje yok
      user.finishedCards.push(bodyFC0);
      iofc = _.findIndex(user.finishedCards, {
        topicId: topicId,
      });
      iofc2 = _.findIndex(user.finishedCards[iofc].cards, {
        cardId: cardId,
      });

      subjects.forEach((element2) => {
        iofc3 = _.findIndex(user.finishedCards[iofc].cards[iofc2].subjects, {
          subjectId: element2.subjectId,
        });
        updateTreasures();
        updateAccuracyPercentage();
      });
      break;
    }
  }

  user.finishedCards.sort(function (a, b) {
    return a.topicId - b.topicId;
  });

  for (let i = 0; i < user.finishedCards.length; i++) {
    user.finishedCards[i].cards.sort(function (a, b) {
      return a.cardId - b.cardId;
    });
  }

  for (let i = 0; i < user.finishedCards.length; i++) {
    for (let j = 0; j < user.finishedCards[i].cards.length; j++) {
      user.finishedCards[i].cards[j].subjects.sort(function (a, b) {
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
            finishedCards: user.finishedCards,
            logCards: user.logCards,
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
