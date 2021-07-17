// Cardend model
const Joi = require('joi');
const mongoose = require('mongoose');
const { finishedCardSchema } = require('./finishedCard');
const { logCardSchema } = require('../log/logCard');

const cardendSchema = new mongoose.Schema({
  user: {
    type: new mongoose.Schema({}),
    required: true,
  },
  finishedCards: [finishedCardSchema],
  logCards: [logCardSchema],
});

const Cardend = mongoose.model('Cardend', cardendSchema);

function validateCardend(cardend) {
  const schema = {
    user_id: Joi.objectId().required(),
    finishedCards: Joi.array(),
    logCards: Joi.array(),
  };

  return Joi.validate(cardend, schema);
}

exports.Cardend = Cardend;
exports.validate = validateCardend;
