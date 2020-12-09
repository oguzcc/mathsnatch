const Joi = require("joi");
const mongoose = require("mongoose");

const topicFCSchema = new mongoose.Schema({
  cardId: {
    type: String,
    min: 2,
    max: 2,
  },
  correctInCard: {
    type: Number,
    default: 0,
    min: 0,
  },
  wrongInCard: {
    type: Number,
    default: 0,
    min: 0,
  },
  accuracyPercentageInCard: {
    type: Number,
    default: 0,
    min: 0,
  },
});

function validateTopicFC(topicFC) {
  const schema = {
    cardId: Joi.string().min(2).max(2),
    correctInCard: Joi.number().min(0),
    wrongInCard: Joi.number().min(0),
    accuracyPercentageInCard: Joi.number().min(0).max(100),
  };

  return Joi.validate(topicFC, schema);
}

exports.topicFCSchema = topicFCSchema;
exports.validate = validateTopicFC;
