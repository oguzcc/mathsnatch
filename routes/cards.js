const { Card, validate } = require('../models/card/card');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const { client } = require('../startup/redis_client');
const cache = require('../middleware/redis/cache_cards');
const _ = require('lodash');
const express = require('express');
const router = express.Router();

// cardlar topicId query ile cagrilabilir
router.get('/', [auth], async (req, res) => {
  const queryResult = await req.query;
  const cards = await Card.find(queryResult)
    .sort('topicId')
    .select('-_id -__v -cards._id');

  if (!cards || cards.length == 0)
    return res
      .status(404)
      .send('The cards with the given topicId was not found.');
  // client.set('cards', JSON.stringify(cards[0].cards), 'EX', 3600 * 24);

  res.send(cards[0].cards);
});

// ya da buradaki gibi parametre olarak
router.get('/:topicId', [auth], async (req, res) => {
  const topicId = req.params.topicId;

  const cards = await Card.find({
    topicId: topicId,
  }).select('-_id -__v -cards._id');

  if (!cards || cards.length == 0)
    return res
      .status(404)
      .send('The cards with the given topicId was not found.');

  res.send(cards[0].cards);
});

router.post('/', [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const card = new Card(_.pick(req.body, ['topicId', 'cards']));

  await card.save();

  res.send(card);
});

module.exports = router;
