// Question model
const Joi = require('joi');
const mongoose = require('mongoose');
const { answerSchema } = require('./answer');

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
    min: 9,
    max: 9,
    requried: true,
  },
  questionLevel: {
    type: Number,
    min: 1,
    max: 5,
    requried: true,
  },
  responseTime: {
    type: Number,
    default: 15,
  },
  layoutType: {
    type: Number,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  semanticQuestion: {
    type: String,
    required: true,
  },
  semanticAnswer: {
    type: String,
    required: true,
  },
  questionType: {
    type: String,
  },
  gameTypes: [String],
  answers: [answerSchema],
});

const Question = mongoose.model('Question', questionSchema);

function validateQuestion(question) {
  const schema = {
    topicId: Joi.string().min(2).max(2).required(),
    cardId: Joi.string().min(4).max(4).required(),
    subjectId: Joi.string().min(6).max(6).required(),
    questionId: Joi.string().min(9).max(9).required(),
    questionLevel: Joi.number().min(1).max(5).required(),
    responseTime: Joi.number().default(15).required(),
    layoutType: Joi.number().required(),
    question: Joi.string().required(),
    semanticQuestion: Joi.string().required(),
    semanticAnswer: Joi.string().required(),
    questionType: Joi.string().required(),
    gameTypes: Joi.array().required(),
    answers: Joi.array().required(),
  };

  return Joi.validate(question, schema);
}

exports.Question = Question;
exports.validate = validateQuestion;
