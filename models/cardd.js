// Card model -> cards array
const Joi = require("joi");
const mongoose = require("mongoose");

const carddSchema = new mongoose.Schema({
  cardId: {
    type: String,
    min: 4,
    max: 4,
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

const Cardd = mongoose.model("Cardd", carddSchema);

function validateCardd(cardd) {
  const schema = {
    cardId: Joi.string().min(4).max(4).required(),
    cardName: Joi.string().min(3).max(64).required(),
    cardPic: Joi.string().min(3).required(),
  };

  return Joi.validate(cardd, schema);
}

exports.carddSchema = carddSchema;
exports.validate = validateCardd;
