const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User } = require('../models/user/user');
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

module.exports = router;
