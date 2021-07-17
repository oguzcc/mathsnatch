const { Avatar, validate } = require('../models/user/avatar');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const { client } = require('../startup/redis_client');
const cache = require('../middleware/redis/cache_avatars');
const _ = require('lodash');
const express = require('express');
const router = express.Router();

router.get('/', [auth], async (req, res) => {
  const avatars = await Avatar.find();
  // client.set('avatars', JSON.stringify(avatars), 'EX', 3600 * 24 * 7);

  res.send(avatars);
});

router.post('/', [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const avatar = new Avatar(_.pick(req.body, ['avatarSvg']));

  await avatar.save();

  res.send(avatar);
});

module.exports = router;
