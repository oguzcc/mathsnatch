const { validate } = require("../models/cardend");
const { User } = require("../models/user");
const auth = require("../middleware/auth");
const _ = require("lodash");
const mongoose = require("mongoose");
const Fawn = require("fawn");
const express = require("express");
const { parseInt } = require("lodash");
const router = express.Router();

Fawn.init(mongoose);

router.post("/", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.user._id !== req.body.user_id)
    return res.status(401).send("Access denied");

  const user = await User.findById(req.body.user_id);
  if (!user) return res.status(400).send("Invalid user.");

  const bodyFC0 = req.body.finishedCards[0];
  const topicId = bodyFC0.topicId;
  const cardId = bodyFC0.cards[0].cardId;
  const bodyCA = bodyFC0.cards[0].correctInCard;
  const bodyWA = bodyFC0.cards[0].wrongInCard;

  //// if (!_.some(user.finishedCards, bodyFC0)) {
  ////   user.finishedCards.push(bodyFC0);
  //// }
  let iofc;
  let iofc2;

  iofc = _.findIndex(user.finishedCards, {
    topicId: topicId,
  });

  if (iofc != -1) {
    // topicId ye sahip obje mevcut
    iofc2 = _.findIndex(user.finishedCards[iofc].cards, {
      cardId: cardId,
    });
    if (iofc2 == -1) {
      // cardId ye sahip obje yok
      user.finishedCards[iofc].cards.push(bodyFC0.cards[0]);
      iofc2 = _.findIndex(user.finishedCards[iofc].cards, {
        cardId: cardId,
      });
    } else {
      //user answers in card updated
      user.finishedCards[iofc].cards[iofc2].correctInCard =
        user.finishedCards[iofc].cards[iofc2].correctInCard + bodyCA;
      user.finishedCards[iofc].cards[iofc2].wrongInCard =
        user.finishedCards[iofc].cards[iofc2].wrongInCard + bodyWA;
    }
  } else {
    // o topicId ye sahip obje yok
    user.finishedCards.push(bodyFC0);
    iofc = _.findIndex(user.finishedCards, {
      topicId: topicId,
    });
    iofc2 = 0;
  }

  // accuracy percentage updated
  user.finishedCards[iofc].cards[iofc2].accuracyPercentageInCard =
    (user.finishedCards[iofc].cards[iofc2].correctInCard /
      (user.finishedCards[iofc].cards[iofc2].correctInCard +
        user.finishedCards[iofc].cards[iofc2].wrongInCard)) *
    100;

  // user answers updated
  user.correctAnswers = user.correctAnswers + bodyCA;
  user.wrongAnswers = user.wrongAnswers + bodyWA;
  user.accuracyPercentage =
    (user.correctAnswers / (user.correctAnswers + user.wrongAnswers)) * 100;
  //user.coins = user.coins + parseInt(bodyCA) * 100;
  //user.level = user.level + user.coins / 1000;

  user.finishedCards.sort(function (a, b) {
    return a.topicId - b.topicId;
  });

  for (let i = 0; i < user.finishedCards.length; i++) {
    user.finishedCards[i].cards.sort(function (a, b) {
      return a.cardId - b.cardId;
    });
  }

  /*////  user.finishedCards[iofc].correctInCard =
    user.finishedCards[iofc].correctInCard + bodyCQ;
  user.finishedCards[iofc].wrongInCard =
    user.finishedCards[iofc].wrongInCard + bodyWQ;
  user.finishedCards[iofc].accuracyPercentageInCard =
    (user.finishedCards[iofc].correctInCard /
      (user.finishedCards[iofc].correctInCard +
        user.finishedCards[iofc].wrongInCard)) *
    100; */

  /*//// for (let i = 0; i < req.body.finishedCards.length; i++) {
    if (!_.some(user.finishedCards, req.body.finishedCards[i])) {
      user.finishedCards.push(req.body.finishedCards[i]);
    }
  } */

  /*   for (let i = 0; i < req.body.finishedQuestions.length; i++) {
    let question = {};
    question = await Question.findById(
      req.body.finishedQuestions[i].question_id
    );
    if (req.body.finishedQuestions[i].isCorrect) {
      question.correctNumber = question.correctNumber + 1;
      question.questionLevel =
        (question.correctNumber /
          (question.correctNumber + question.wrongNumber)) *
        100;
      await question.save();
    } else {
      question.wrongNumber = question.wrongNumber + 1;
      question.questionLevel =
        (question.correctNumber /
          (question.correctNumber + question.wrongNumber)) *
        100;
      await question.save();
    }
  } */

  try {
    new Fawn.Task()
      .update(
        "users",
        { _id: user._id },
        {
          $set: {
            gems: user.gems,
            coins: user.coins,
            level: user.level,
            correctAnswers: user.correctAnswers,
            wrongAnswers: user.wrongAnswers,
            accuracyPercentage: user.accuracyPercentage,
            lastOnline: new Date(),
            finishedCards: user.finishedCards,
          },
        }
      )
      .run();

    res.send(
      _.pick(user, [
        "_id",
        "name",
        "email",
        "isAdmin",
        "isGold",
        "lastOnline",
        "gems",
        "coins",
        "level",
        "correctAnswers",
        "wrongAnswers",
        "accuracyPercentage",
        "finishedCards",
      ])
    );
  } catch (ex) {
    res.status(500).send("Something failed.");
  }
});

module.exports = router;
