// Question model request
const Joi = require("joi");
const mongoose = require("mongoose");

const restQuestionSchema = new mongoose.Schema({
  restQuestions: {
    type: Array,
    required: true,
  },
});

const RestQuestion = mongoose.model("RestQuestion", restQuestionSchema);

function validateRestQuestion(restQuestion) {
  const schema = {
    restQuestions: Joi.array().required(),
  };

  return Joi.validate(restQuestion, schema);
}

exports.RestQuestion = RestQuestion;
exports.validate = validateRestQuestion;
