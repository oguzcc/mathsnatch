// User model -> finishedChallenges array
const Joi = require('joi');
const mongoose = require('mongoose');
const { cardFChSchema } = require('./cardFCh');

const finishedChallengeSchema = new mongoose.Schema({
  topicId: {
    type: String,
    min: 2,
    max: 2,
    required: true,
  },
  cards: [cardFChSchema],
});

function validateFinishedChallenge(finishedChallenge) {
  const schema = {
    topicId: Joi.string().min(2).max(2).required(),
    cards: Joi.array(),
  };

  return Joi.validate(finishedChallenge, schema);
}

exports.finishedChallengeSchema = finishedChallengeSchema;
exports.validate = validateFinishedChallenge;
