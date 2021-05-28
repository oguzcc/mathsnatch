const { Avatar, validate } = require('../models/user/avatar');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const { client } = require('../startup/redis_client');
const cache = require('../middleware/redis/cache_avatars');
const _ = require('lodash');
const express = require('express');
const router = express.Router();

// router.get('/', cache, async (req, res) => {
//   try {
//     console.log('Fetching Data...');

//     const response = await fetch(`https://api.github.com/users/oguzcc`);

//     const data = await response.json();

//     const repos = data.public_repos;

//     client.setex('oguzcc', 20, repos);

//     res.send(`${repos}`);
//   } catch (err) {
//     console.error(err);
//     res.status(500);
//   }
// });

router.get('/', [auth, cache], async (req, res) => {
  const avatars = await Avatar.find();
  client.setex('avatars', 3600 * 24, JSON.stringify(avatars));
  // console.log('getting from database');
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
