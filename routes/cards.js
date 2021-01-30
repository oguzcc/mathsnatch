const { Card, validate } = require("../models/card");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const _ = require("lodash");
const express = require("express");
const router = express.Router();

// cardlar topicId query ile cagrilabilir
router.get("/", [auth], async (req, res) => {
  const queryResult = await req.query;
  const cards = await Card.find(queryResult)
    .sort("topicId")
    .select("-_id -__v -cards._id");
  res.send(cards[0].cards);
});

// ya da buradaki gibi parametre olarak
router.get("/:topicId", [auth], async (req, res) => {
  const topicId = req.params.topicId;

  const cards = await Card.find({
    topicId: topicId,
  }).select("-_id -__v -cards._id");

  if (!cards)
    return res.status(404).send("The topic with the given Id was not found.");

  res.send(cards[0].cards);
});

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const card = new Card(_.pick(req.body, ["topicId", "cards"]));

  await card.save();

  res.send(card);
});

module.exports = router;
