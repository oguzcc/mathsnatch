// Question model
const Joi = require("joi");
const mongoose = require("mongoose");
const { answerSchema } = require("./answer");

const questionSchema = new mongoose.Schema({
  topicId: {
    type: String,
    min: 2,
    max: 2,
    requried: true,
  },
  cardId: {
    type: String,
    min: 4,
    max: 4,
    requried: true,
  },
  subjectId: {
    type: String,
    min: 6,
    max: 6,
    requried: true,
  },
  questionId: {
    type: String,
    min: 8,
    max: 8,
    requried: true,
  },
  questionLevel: {
    type: Number,
    min: 0,
    max: 5,
    requried: true,
  },
  responseTime: {
    type: Number,
    default: 15,
  },
  bindVideoId: {
    type: String,
    min: 6,
    max: 6,
    required: true,
  },
  wrongQuestionId: {
    type: String,
    min: 8,
    max: 8,
    requried: true,
  },
  correctQuestionId: {
    type: String,
    min: 8,
    max: 8,
    requried: true,
  },
  question: {
    type: String,
    required: true,
  },
  answers: [answerSchema],
});

const Question = mongoose.model("Question", questionSchema);

function validateQuestion(question) {
  const schema = {
    topicId: Joi.string().min(2).max(2).required(),
    cardId: Joi.string().min(4).max(4).required(),
    subjectId: Joi.string().min(6).max(6).required(),
    questionId: Joi.string().min(8).max(8).required(),
    questionLevel: Joi.number().min(0).max(5).required(),
    responseTime: Joi.number().default(15),
    bindVideoId: Joi.string().min(6).max(6),
    wrongQuestionId: Joi.string().min(8).max(8),
    correctQuestionId: Joi.string().min(8).max(8),
    question: Joi.string(),
    answers: Joi.array(),
  };

  return Joi.validate(question, schema);
}

exports.Question = Question;
exports.validate = validateQuestion;
