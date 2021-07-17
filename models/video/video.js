// Video model
const Joi = require('joi');
const mongoose = require('mongoose');
const { questionsSSchema } = require('./questionsS');

const videoSchema = new mongoose.Schema({
  topicId: {
    type: String,
    min: 2,
    max: 2,
    required: true,
  },
  cardId: {
    type: String,
    min: 4,
    max: 4,
    required: true,
  },
  subjectId: {
    type: String,
    min: 6,
    max: 6,
    required: true,
  },
  videoId: {
    type: String,
    min: 6,
    max: 6,
    required: true,
  },
  videoLevel: {
    type: Number,
    min: 1,
    max: 5,
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
  wrongVideoId: {
    type: String,
    required: true,
    min: 6,
    max: 6,
  },
  correctVideoId: {
    type: String,
    required: true,
    min: 6,
    max: 6,
  },
  videoQuestion: [questionsSSchema],
});

const Video = mongoose.model('Video', videoSchema);

function validateVideo(video) {
  const schema = {
    topicId: Joi.string().min(2).max(2).required(),
    cardId: Joi.string().min(4).max(4).required(),
    subjectId: Joi.string().min(6).max(6).required(),
    videoId: Joi.string().min(6).max(6).required(),
    videoLevel: Joi.number().min(1).max(5).required(),
    videoLink: Joi.string().required(),
    solutionVideoLink: Joi.string().required(),
    wrongVideoId: Joi.string().min(6).max(6).required(),
    correctVideoId: Joi.string().min(6).max(6).required(),
    videoQuestion: Joi.array(),
  };

  return Joi.validate(video, schema);
}

exports.Video = Video;
exports.validate = validateVideo;
