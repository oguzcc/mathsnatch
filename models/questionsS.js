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
});

function validateQuestionsS(questionsS) {
  const schema = {
    cardId: Joi.string().min(3).max(3),
    correctInCard: Joi.number().min(0),
    wrongInCard: Joi.number().min(0),
    accuracyPercentageInCard: Joi.number().min(0).max(100),
  };

  return Joi.validate(questionsS, schema);
}

exports.questionsSSchema = questionsSSchema;
exports.validate = validateQuestionsS;
