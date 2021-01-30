// User model -> finishedCards array
const Joi = require("joi");
const mongoose = require("mongoose");
const { cardFCSchema } = require("./cardFC");

const finishedCardSchema = new mongoose.Schema({
  topicId: {
    type: String,
    min: 2,
    max: 2,
    required: true,
  },
  cards: [cardFCSchema],
});

function validateFinishedCard(finishedCard) {
  const schema = {
    topicId: Joi.string().min(2).max(2).required(),
    cards: Joi.array(),
  };

  return Joi.validate(finishedCard, schema);
}

exports.finishedCardSchema = finishedCardSchema;
exports.validate = validateFinishedCard;
