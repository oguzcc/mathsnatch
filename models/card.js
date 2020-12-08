const Joi = require("joi");
const mongoose = require("mongoose");
const { carddSchema } = require("./cardd");

const cardSchema = new mongoose.Schema({
  topicId: {
    type: String,
    min: 3,
    max: 3,
    required: true,
  },
  cards: [carddSchema],
});

const Card = mongoose.model("Card", cardSchema);

function validateCard(card) {
  const schema = {
    topicId: Joi.string().min(3).max(3).required(),
    cards: Joi.array(),
  };

  return Joi.validate(card, schema);
}

exports.Card = Card;
exports.validate = validateCard;
