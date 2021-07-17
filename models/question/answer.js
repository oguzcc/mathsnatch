// Question model -> answers array
const Joi = require('joi');
const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  answer: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    requried: true,
  },
});

function validateAnswer(answer) {
  const schema = {
    answer: Joi.string(),
    isCorrect: Joi.boolean(),
  };

  return Joi.validate(answer, schema);
}

exports.answerSchema = answerSchema;
exports.validate = validateAnswer;
