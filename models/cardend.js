const Joi = require("joi");
const mongoose = require("mongoose");
const { finishedCardSchema } = require("./finishedCard");

const cardendSchema = new mongoose.Schema({
  user: {
    type: new mongoose.Schema({}),
    required: true,
  },
  lastOnline: {
    type: Date,
    default: Date.now,
  },
  finishedCards: [finishedCardSchema],
});

const Cardend = mongoose.model("Cardend", cardendSchema);

function validateCardend(cardend) {
  const schema = {
    user_id: Joi.objectId().required(),
    lastOnline: Joi.date(),
    remainingTime: Joi.number().min(0),
    correctQuestions: Joi.number().min(0),
    wrongQuestions: Joi.number().min(0),
    finishedCards: Joi.array(),
  };

  return Joi.validate(cardend, schema);
}

exports.Cardend = Cardend;
exports.validate = validateCardend;
