const Joi = require("joi");
const mongoose = require("mongoose");
const { cardSchema } = require("./card");

const topicSchema = new mongoose.Schema({
  topicId: {
    type: String,
    required: true,
  },
  topicName: {
    type: String,
    required: true,
  },
  topicPic: {
    type: String,
    required: true,
  },
  cards: [cardSchema],
});

const Topic = mongoose.model("Topic", topicSchema);

function validateTopic(topic) {
  const schema = {
    topicId: Joi.string().min(3).max(3).required(),
    topicName: Joi.string().min(3).max(64).required(),
    topicPic: Joi.string().min(3).required(),
    cards: Joi.array(),
  };

  return Joi.validate(topic, schema);
}

exports.Topic = Topic;
exports.validate = validateTopic;
