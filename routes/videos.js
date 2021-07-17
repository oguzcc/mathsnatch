const { Video, validate } = require('../models/video/video');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const { client } = require('../startup/redis_client');
const cache = require('../middleware/redis/cache_videos');
const _ = require('lodash');
const express = require('express');
const router = express.Router();

// videolar videoId query ile cagrilabilir
router.get('/', [auth], async (req, res) => {
  const queryResult = await req.query;
  const videos = await Video.find(queryResult).select(
    '-_id -__v -videoQuestion._id'
  );

  if (!videos || videos.length == 0)
    return res.status(404).send('The video with the given Id was not found.');

  videos.length == 1 ? res.send(videos[0]) : res.send(videos);
  // client.set('videos', JSON.stringify(videos), 'EX', 3600 * 24);

  // res.send(videos);
});

// ya da parametre olarak
router.get('/:videoId', [auth], async (req, res) => {
  const videoId = req.params.videoId;

  const video = await Video.find({
    videoId: videoId,
  }).select('-_id -__v -videoQuestion._id');

  if (!video || video.length == 0)
    return res.status(404).send('The video with the given Id was not found.');

  res.send(video[0]);
});

router.post('/', [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const video = new Video(
    _.pick(req.body, [
      'topicId',
      'cardId',
      'subjectId',
      'videoId',
      'videoLevel',
      'videoLink',
      'solutionVideoLink',
      'wrongVideoId',
      'correctVideoId',
      'videoQuestion',
    ])
  );

  await video.save();

  res.send(video);
});

module.exports = router;
