const Joi = require("joi");
const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  cardId: {
    type: String,
    min: 3,
    max: 3,
    required: true,
  },
  cardName: {
    type: String,
    min: 3,
    max: 64,
    required: true,
  },
  cardPic: {
    type: String,
    required: true,
  },
});

function validateCard(card) {
  const schema = {
    cardId: Joi.string().min(3).max(3).required(),
    cardName: Joi.string().min(3).max(64).required(),
    cardPic: Joi.string().min(3).required(),
  };

  return Joi.validate(card, schema);
}

exports.cardSchema = cardSchema;
exports.validate = validateCard;
