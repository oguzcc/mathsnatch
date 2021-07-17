// User model -> finishedCards array -> cardFC array
const Joi = require('joi');
const mongoose = require('mongoose');
const { subjectFCSchema } = require('./subjectFC');

const cardFCSchema = new mongoose.Schema({
  cardId: {
    type: String,
    min: 4,
    max: 4,
  },
  subjects: [subjectFCSchema],
});

function validateCardFC(cardFC) {
  const schema = {
    cardId: Joi.string().min(4).max(4),
    subjects: Joi.array(),
  };

  return Joi.validate(cardFC, schema);
}

exports.cardFCSchema = cardFCSchema;
exports.validate = validateCardFC;
