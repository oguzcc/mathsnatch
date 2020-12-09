const Joi = require("joi");
const mongoose = require("mongoose");
const { topicFCSchema } = require("./topicFC");

const finishedCardSchema = new mongoose.Schema({
  topicId: {
    type: String,
    min: 3,
    max: 3,
    required: true,
  },
  cards: [topicFCSchema],
});

function validateFinishedCard(finishedCard) {
  const schema = {
    topicId: Joi.string().min(3).max(3).required(),
    cards: Joi.array(),
  };

  return Joi.validate(finishedCard, schema);
}

exports.finishedCardSchema = finishedCardSchema;
exports.validate = validateFinishedCard;
