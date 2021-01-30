const Joi = require("joi");
const mongoose = require("mongoose");

const questionsSSchema = new mongoose.Schema({
  questionId: {
    type: String,
    min: 8,
    max: 8,
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
  questionLevel: {
    type: Number,
    min: 0,
    max: 5,
  },
  responseTime: {
    type: Number,
    default: 15,
  },
});

function validateQuestionsS(questionsS) {
  const schema = {
    questionId: Joi.string().min(8).max(8).required(),
    question: Joi.string().required(),
    correctAnswer: Joi.string().required(),
    wrongAnswer: Joi.string().required(),
    responseTime: Joi.number().default(15),
  };

  return Joi.validate(questionsS, schema);
}

exports.questionsSSchema = questionsSSchema;
exports.validate = validateQuestionsS;
