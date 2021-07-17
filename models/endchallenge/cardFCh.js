// User model -> finishedChallenges array -> cardFCh array
const Joi = require('joi');
const mongoose = require('mongoose');
const { subjectFChSchema } = require('./subjectFCh');

const cardFChSchema = new mongoose.Schema({
  cardId: {
    type: String,
    min: 4,
    max: 4,
  },
  subjects: [subjectFChSchema],
});

function validateCardFCh(cardFCh) {
  const schema = {
    cardId: Joi.string().min(4).max(4),
    subjects: Joi.array(),
  };

  return Joi.validate(cardFCh, schema);
}

exports.cardFChSchema = cardFChSchema;
exports.validate = validateCardFCh;
