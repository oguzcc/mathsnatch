const { Rest, validate } = require("../models/rest");
const { Video } = require("../models/video");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const _ = require("lodash");
const express = require("express");
const router = express.Router();

router.put("/:topicId/:cardId", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const topicId = req.params.topicId;
  const cardId = req.params.cardId;

  const rest = new Rest(_.pick(req.body, ["restVideos"]));

  for (const q of rest.restVideos) {
    if (topicId != q.topicId || cardId != q.cardId) {
      return res.status(400).send("topicId or cardId did not matched");
    }
  }

  for (const q of rest.restVideos) {
    let videoId = q.videoId;

    video = await Video.findOneAndUpdate(
      { topicId: topicId, cardId: cardId, videoId: videoId },
      {
        $set: {
          topicId: q.topicId,
          cardId: q.cardId,
          videoId: q.videoId,
          videoLink: q.videoLink,
          solutionVideoLink: q.solutionVideoLink,
          correctVideoId: q.correctVideoId,
          wrongVideoId: q.wrongVideoId,
          questions: q.questions,
        },
      },
      { new: true }
    );

    if (!video) {
      video = new Video({
        topicId: q.topicId,
        cardId: q.cardId,
        videoId: q.videoId,
        videoLink: q.videoLink,
        solutionVideoLink: q.solutionVideoLink,
        correctVideoId: q.correctVideoId,
        wrongVideoId: q.wrongVideoId,
        questions: q.questions,
      });
      await video.save();
    }
  }

  res.send("Completed successfully.");
});

module.exports = router;
