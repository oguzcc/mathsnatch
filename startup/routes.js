const express = require('express');
const questions = require('../routes/questions');
const topics = require('../routes/topics');
const cards = require('../routes/cards');
const users = require('../routes/users');
const avatars = require('../routes/avatars');
const videos = require('../routes/videos');
const cardends = require('../routes/cardends');
const challengeends = require('../routes/challengeends');
const auth = require('../routes/auth');
const error = require('../middleware/error');

module.exports = function (app) {
  app.use(express.json());
  app.use('/api/questions', questions);
  app.use('/api/topics', topics);
  app.use('/api/cards', cards);
  app.use('/api/users', users);
  app.use('/api/avatars', avatars);
  app.use('/api/videos', videos);
  app.use('/api/cardends', cardends);
  app.use('/api/challengeends', challengeends);
  app.use('/api/auth', auth);
  app.use(error);
};
