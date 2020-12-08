const Joi = require("joi");
const mongoose = require("mongoose");

const questionsSSchema = new mongoose.Schema({
  questionId: {
    type: String,
    min: 1,
    max: 1,
    requried: true,
  },
  question: {
    type: String,
    required: true,
  },
  correctAnswer: {
    type: String,
    required: true,
  },
  wrongAnswer: {
    type: String,
    required: true,
  },
});

function validateQuestionsS(questionsS) {
  const schema = {
    questionId: Joi.string().min(1).max(1),
    question: Joi.string(),
    correctAnswer: Joi.string(),
    wrongAnswer: Joi.string(),
  };

  return Joi.validate(questionsS, schema);
}

exports.questionsSSchema = questionsSSchema;
exports.validate = validateQuestionsS;
