// Challengeend model
const Joi = require('joi');
const mongoose = require('mongoose');
const { finishedChallengeSchema } = require('./finishedChallenge');

const challengeendSchema = new mongoose.Schema({
  user: {
    type: new mongoose.Schema({}),
    required: true,
  },
  finishedChallenges: [finishedChallengeSchema],
});

const Challengeend = mongoose.model('Challengeend', challengeendSchema);

function validateChallengeend(challengeend) {
  const schema = {
    user_id: Joi.objectId().required(),
    finishedChallenges: Joi.array(),
  };

  return Joi.validate(challengeend, schema);
}

exports.Challengeend = Challengeend;
exports.validate = validateChallengeend;
