// Video request model
const Joi = require("joi");
const mongoose = require("mongoose");

const restSchema = new mongoose.Schema({
  restVideos: {
    type: Array,
    required: true,
  },
});

const Rest = mongoose.model("Rest", restSchema);

function validateRest(rest) {
  const schema = {
    restVideos: Joi.array().required(),
  };

  return Joi.validate(rest, schema);
}

exports.Rest = Rest;
exports.validate = validateRest;
