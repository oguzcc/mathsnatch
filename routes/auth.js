const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User, validate } = require('../models/user/user');
const { Avatar } = require('../models/user/avatar');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/guest', async (req, res) => {
  const date = Date.now().toString();
  const name = 'guest' + date;
  const email = name + '@mathsnatch.com';
  const password = date;
  const avatar = '5e446b6a9608ec4934a599ef';

  let user = new User({
    name: name,
    email: email,
    password: password,
    avatar: avatar,
    userType: 'guest',
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  await user.save();
  const token = user.generateAuthToken();

  user = await User.findById(user._id)
    .select(
      '-password -__v -finishedCards._id -finishedCards.cards._id -finishedCards.cards.subjects._id -finishedChallenges._id -finishedChallenges.cards._id -finishedChallenges.cards.subjects._id'
    )
    .populate('avatar', 'avatarSvg');

  res.header('x-auth-token', token).send(user);
});

router.post('/register', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ name: req.body.name });
  if (user && user.name === req.body.name)
    return res.status(400).send('This user name is already in use.');

  user = {};
  user = await User.findOne({ email: req.body.email });
  if (user && user.email === req.body.email)
    return res.status(400).send('This email is already in use.');

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: password,
    age: req.body.age,
    avatar: '5e446b6a9608ec4934a599ef',
    location: req.body.location,
    lastOnline: Date.now(),
    userType: 'registered',
  });

  await user.save();

  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send();
});

router.post('/login', async (req, res) => {
  const { error } = validateAuth(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email.');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid password.');

  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send();
});

function validateAuth(req) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  };

  return Joi.validate(req, schema);
}

module.exports = router;
