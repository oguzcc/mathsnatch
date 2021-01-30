// Card model request
const Joi = require("joi");
const mongoose = require("mongoose");

const restCardSchema = new mongoose.Schema({
  restCards: {
    type: Array,
    required: true,
  },
});

const RestCard = mongoose.model("RestCard", restCardSchema);

function validateRestCard(restCard) {
  const schema = {
    restCards: Joi.array().required(),
  };

  return Joi.validate(restCard, schema);
}

exports.RestCard = RestCard;
exports.validate = validateRestCard;
