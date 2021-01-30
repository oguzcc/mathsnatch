// User model -> finishedChallenges array -> cardFCh array -> subjectFCh array
const Joi = require("joi");
const mongoose = require("mongoose");

const subjectFChSchema = new mongoose.Schema({
  subjectId: {
    type: String,
    min: 6,
    max: 6,
  },
  correctInSubject: {
    type: Number,
    default: 0,
    min: 0,
  },
  wrongInSubject: {
    type: Number,
    default: 0,
    min: 0,
  },
  accuracyPercentageInSubject: {
    type: Number,
    min: 0,
    max: 100,
  },
});

function validateSubjectFCh(subjectFCh) {
  const schema = {
    subjectId: Joi.string().min(6).max(6),
    correctInSubject: Joi.number().min(0),
    wrongInSubject: Joi.number().min(0),
    accuracyPercentageInSubject: Joi.number().min(0).max(100),
  };

  return Joi.validate(subjectFCh, schema);
}

exports.subjectFChSchema = subjectFChSchema;
exports.validate = validateSubjectFCh;
