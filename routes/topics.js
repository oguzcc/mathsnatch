const { Topic, validate } = require('../models/topic/topic');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const { client } = require('../startup/redis_client');
const cache = require('../middleware/redis/cache_topics');
const _ = require('lodash');
const express = require('express');
const router = express.Router();

// topicler topicId query ile cagrilabilir
router.get('/', [auth], async (req, res) => {
  const queryResult = await req.query;
  const topics = await Topic.find(queryResult)
    .sort('topicId')
    .select('-_id -__v');
  // client.set('topics', JSON.stringify(topics), 'EX', 3600 * 24);

  if (!topics || topics.length == 0)
    return res.status(404).send('The topic with the given Id was not found.');

  topics.length == 1 ? res.send(topics[0]) : res.send(topics);
});

// ya da parametre olarak
router.get('/:topicId', [auth], async (req, res) => {
  const topicId = req.params.topicId;

  const topic = await Topic.find({
    topicId: topicId,
  }).select('-_id -__v');

  if (!topic || topic.length == 0)
    return res.status(404).send('The topic with the given Id was not found.');

  res.send(topic[0]);
});

router.post('/', [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const topic = new Topic(
    _.pick(req.body, ['topicId', 'topicName', 'topicPic', 'difficulty'])
  );

  await topic.save();

  res.send(topic);
});

module.exports = router;
