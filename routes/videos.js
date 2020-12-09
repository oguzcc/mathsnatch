const { Video, validate } = require("../models/video");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const _ = require("lodash");
const express = require("express");
const router = express.Router();

router.get("/", [auth], async (req, res) => {
  const queryResult = await req.query;
  const videos = await Video.find(queryResult).select("-_id -__v");
  res.send(videos);
});

/* router.get("/:videoId", [auth], async (req, res) => {
  const videoId = req.params.videoId;

  const video = await Video.find({
    videoId: videoId,
  }).select("-_id -__v");

  if (!video)
    return res.status(404).send("The video with the given Id was not found.");

  res.send(video);
}); */

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const video = new Video(
    _.pick(req.body, [
      "topicId cardId videoId videoLink solutionVideoLink correctVideoId wrongVideoId questions",
    ])
  );

  await video.save();

  res.send(video);
});

module.exports = router;
