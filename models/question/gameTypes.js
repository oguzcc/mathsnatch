// Question model -> gameTypes array
const Joi = require('joi');
const mongoose = require('mongoose');

const gameTypeSchema = new mongoose.Schema({
  gameType: {
    type: String,
    required: true,
  },
});

function validateGameType(gameType) {
  const schema = {
    gameType: Joi.string(),
  };

  return Joi.validate(gameType, schema);
}

exports.gameTypeSchema = gameTypeSchema;
exports.validate = validateGameType;
