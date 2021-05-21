const { Question, validate } = require("../models/question/question");
const { answerSchema } = require("../models/question/answer");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const _ = require("lodash");
const express = require("express");
const router = express.Router();

// questionlar subjectId, questionId parametre ile cagrilabilir
router.get("/", [auth], async (req, res) => {
  const queryResult = await req.query;
  const questions = await Question.aggregate([
    {
      $match: {
        $or: [
          { subjectId: queryResult.subjectId },
          { cardId: queryResult.cardId },
        ],
      },
    },
    { $sample: { size: 50 } },
  ]);
  // const questions = await Question.find(queryResult)
  //   .sort("questionId")
  //   .select("-_id -__v -answers._id")
  //   .limit(50);
  res.send(questions);
});

// ya da parametre olarak
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
      "layoutType",
      "question",
      "semanticQuestion",
      "semanticAnswer",
      "gameTypes",
      "answers",
    ])
  );

  await question.save();

  res.send(question);
});

module.exports = router;
