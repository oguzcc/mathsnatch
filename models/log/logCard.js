// User model -> finishedCards array -> topicFC array
const Joi = require('joi');
const mongoose = require('mongoose');

const logCardSchema = new mongoose.Schema({
  timeStamp: {
    type: Date,
    default: Date.now,
  },
  questionVId: {
    type: String,
    min: 8,
    max: 8,
    requried: true,
  },
  responseTimeOfQuestion: {
    type: Number,
    default: 5,
    required: true,
  },
  result: {
    type: Boolean,
    default: false,
  },
});

function validateLogCard(logCard) {
  const schema = {
    questionVId: Joi.string().min(8).max(8).required(),
    responseTimeOfQuestion: Joi.number().default(5).required(),
    result: Joi.boolean().default(false).required(),
  };

  return Joi.validate(logCard, schema);
}

exports.logCardSchema = logCardSchema;
exports.validate = validateLogCard;
