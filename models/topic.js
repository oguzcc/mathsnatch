// Topic model
const Joi = require("joi");
const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
  topicId: {
    type: String,
    min: 2,
    max: 2,
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
  difficulty: {
    type: Number,
    required: true,
  },
});

const Topic = mongoose.model("Topic", topicSchema);

function validateTopic(topic) {
  const schema = {
    topicId: Joi.string().min(2).max(2).required(),
    topicName: Joi.string().min(3).max(64).required(),
    topicPic: Joi.string().min(3).required(),
    difficulty: Joi.number().required(),
  };

  return Joi.validate(topic, schema);
}

exports.Topic = Topic;
exports.validate = validateTopic;
