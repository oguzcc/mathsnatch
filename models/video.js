const Joi = require("joi");
const mongoose = require("mongoose");
const { questionsSSchema } = require("./questionsS");

const videoSchema = new mongoose.Schema({
  topicId: {
    type: String,
    min: 3,
    max: 3,
    required: true,
  },
  cardId: {
    type: String,
    min: 3,
    max: 3,
    required: true,
  },
  videoId: {
    type: String,
    min: 2,
    max: 2,
    required: true,
  },
  videoLink: {
    type: String,
    required: true,
  },
  solutionVideoLink: {
    type: String,
    required: true,
  },
  correctVideoId: {
    type: String,
    required: true,
  },
  wrongVideoId: {
    type: String,
    required: true,
  },
  questions: [questionsSSchema],
});

const Video = mongoose.model("Video", videoSchema);

function validateVideo(video) {
  const schema = {
    topicId: Joi.string().min(3).max(3).required(),
    cardId: Joi.string().min(3).max(3).required(),
    videoId: Joi.string().min(2).max(2).required(),
    videoLink: Joi.string().required(),
    solutionVideoLink: Joi.string().required(),
    correctVideoId: Joi.string().required(),
    wrongVideoId: Joi.string().required(),
    questions: Joi.array(),
  };

  return Joi.validate(video, schema);
}

exports.Video = Video;
exports.validate = validateVideo;
