const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const auth = require('../middleware/auth');
const { User } = require('../models/user/user');
const { Avatar } = require('../models/user/avatar');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const validateObjectId = require('../middleware/validateObjectId');

router.post('/:id', [validateObjectId], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ _id: req.params.id });
  if (!user)
    return res.status(404).send('The user with the given Id was not found.');

  user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password.');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password.');

  await User.findByIdAndRemove(req.params.id);

  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(token);
});

/* router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  const token = user.generateAuthToken();
  res.header("x-auth-token", token).send();
}); */

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
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  await user.save();
  const token = user.generateAuthToken();

  /*   res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    isGold: user.isGold,
    access_token: token,
  }); */

  /*   res.write("_id", user._id);
  res.write("name", user.name);
  res.write("email", user.email);
  res.write("isAdmin", user.isAdmin);
  res.write("isGold", user.isGold);
  res.write("access_token", token);
  res.end(); */

  user = await User.findById(user._id)
    .select(
      '-password -__v -finishedCards._id -finishedCards.cards._id -finishedCards.cards.subjects._id -finishedChallenges._id -finishedChallenges.cards._id -finishedChallenges.cards.subjects._id'
    )
    .populate('avatar', 'avatarSvg');

  res.header('x-auth-token', token).send(user);
});

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  };

  return Joi.validate(req, schema);
}

module.exports = router;
