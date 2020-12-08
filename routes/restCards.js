const { RestCard, validate } = require("../models/restCard");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const _ = require("lodash");
const express = require("express");
const router = express.Router();

router.put("/:topicId", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const topicId = req.params.topicId;

  const restCard = new RestCard(_.pick(req.body, ["restCards"]));

  for (const c of restCard.restCards) {
    if (topicId != c.topicId) {
      return res.status(400).send("topicId did not matched");
    }
  }

  for (const c of restCard.restCards) {
    let cardId = c.cardId;

    video = await Video.findOneAndUpdate(
      { topicId: topicId, cardId: cardId },
      {
        $set: {
          topicId: c.topicId,
          cardId: c.cardId,
          cardName: c.cardName,
          cardPic: c.cardPic,
        },
      },
      { new: true }
    );

    if (!video) {
      video = new Video({
        topicId: c.topicId,
        cardId: c.cardId,
        cardName: c.cardName,
        cardPic: c.cardPic,
      });
      await video.save();
    }
  }

  res.send("Completed successfully.");
});

module.exports = router;
