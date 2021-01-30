const { Question, validate } = require("../models/question");
const { answerSchema } = require("../models/answer");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const _ = require("lodash");
const express = require("express");
const router = express.Router();

router.get("/", [auth], async (req, res) => {
  const queryResult = await req.query;
  const questions = await Question.find(queryResult)
    .sort("questionId")
    .select("-_id -__v -answers._id");
  questions.length == 1 ? res.send(questions[0]) : res.send(questions);
});

router.get("/:questionId", [auth], async (req, res) => {
  const questionId = req.params.questionId;

  const question = await Question.find({
    questionId: questionId,
  }).select("-_id -__v -answers._id");

  if (!question)
    return res
      .status(404)
      .send("The question with the given Id was not found.");

  res.send(question[0]);
});

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const question = new Question(
    _.pick(req.body, [
      "topicId",
      "cardId",
      "subjectId",
      "questionId",
      "questionLevel",
      "responseTime",
      "bindVideoId",
      "wrongQuestionId",
      "correctQuestionId",
      "question",
      "answers",
    ])
  );

  await question.save();

  res.send(question);
});

module.exports = router;
