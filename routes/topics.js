const { Topic, validate } = require("../models/topic");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const _ = require("lodash");
const express = require("express");
const router = express.Router();

router.get("/", [auth], async (req, res) => {
  const queryResult = await req.query;
  const topics = await Topic.find(queryResult)
    .sort("topicId")
    .select("-_id -cards._id -__v");
  res.send(topics);
});

router.get("/:topicId", [auth], async (req, res) => {
  const topicId = req.params.topicId;

  const topic = await Topic.find({
    topicId: topicId,
  }).select("-_id -cards._id -__v");

  if (!topic)
    return res.status(404).send("The topic with the given Id was not found.");

  res.send(topic);
});

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const topic = new Topic(
    _.pick(req.body, ["topicId", "topicName", "topicPic", "cards"])
  );

  await topic.save();

  res.send(topic);
});

module.exports = router;
