const { RestQuestion, validate } = require("../models/restQuestion");
const { Question } = require("../models/question");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const _ = require("lodash");
const express = require("express");
const router = express.Router();

router.put("/", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // const questionId = req.params.questionId;

  const restQuestion = new RestQuestion(_.pick(req.body, ["restQuestions"]));

  // for (const q of restQuestion.restQuestions) {
  //   if (questionId != q.questionId) {
  //     return res.status(400).send("questionId did not matched");
  //   }
  // }

  for (const q of restQuestion.restQuestions) {
    let questionId = q.questionId;

    question = await Question.findOneAndUpdate(
      { questionId: questionId },
      {
        $set: {
          topicId: q.topicId,
          cardId: q.cardId,
          questionId: q.questionId,
          questionLevel: q.questionLevel,
          responseTime: q.responseTime,
          question: q.question,
          bindVideoId: q.bindVideoId,
          correctQuestionId: q.correctQuestionId,
          wrongQuestionId: q.wrongQuestionId,
          answers: q.answers,
        },
      },
      { new: true }
    );

    if (!question) {
      question = new Question({
        topicId: q.topicId,
        cardId: q.cardId,
        questionId: q.questionId,
        questionLevel: q.questionLevel,
        responseTime: q.responseTime,
        question: q.question,
        bindVideoId: q.bindVideoId,
        correctQuestionId: q.correctQuestionId,
        wrongQuestionId: q.wrongQuestionId,
        answers: q.answers,
      });
      await question.save();
    }
  }

  res.send("Completed successfully.");
});

module.exports = router;
