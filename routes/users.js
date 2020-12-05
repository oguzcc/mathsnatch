const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const { Avatar } = require("../models/avatar");
const validateObjectId = require("../middleware/validateObjectId");
const express = require("express");
const { boolean } = require("joi");
const router = express.Router();

router.get("/", [auth], async (req, res) => {
  // const user = await User.findById(req.user._id)
  //   .select("name avatar coins gems level location")
  //   .populate("avatar", "avatarSvg");

  //const allUsers = await User.find().select("name coins").sort("-coins");

  // const userIndex = _.findIndex(allUsers, {
  //   name: req.user.name,
  // });

  const users = await User.find()
    .select("name avatar coins gems level location")
    .populate("avatar", "avatarSvg")
    .limit(10)
    .sort("-coins");

  //user.coins = userIndex + 1;

  //users.push(user);

  res.send(users);
});

router.get("/me", [auth], async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("-password -__v")
    .populate("avatar", "avatarSvg");

  // user.finishedCards.sort(function(a, b) {
  //   return a.topicID > b.topicID ? 1 : b.topicID > a.topicID ? -1 : 0;
  // });

  user.finishedCards.sort(function (a, b) {
    return a.topicId - b.topicId;
  });

  for (let i = 0; i < user.finishedCards.length; i++) {
    user.finishedCards[i].cards.sort(function (a, b) {
      return a.cardId - b.cardId;
    });
  }

  res.send(user);
});

/* router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = {};

  user = await User.findOne({ name: req.body.name });
  if (user) return res.status(400).send("This user name is already use.");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email", "isAdmin", "isGold"]));
}); */

router.post("/guest", async (req, res) => {
  const date = Date.now();
  const name = "guest" + date.toString();
  const email = name + "@mathsnatch.com";
  const password = date.toString();
  const avatar = "5e4974be5f83cf2170cf7871";

  const user = new User({
    name: name,
    email: email,
    password: password,
    avatar: avatar,
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  await user.save();
  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email", "isAdmin", "isGold"]));
});

router.patch("/:id", [auth, validateObjectId], async (req, res) => {
  if (req.user._id !== req.params.id)
    return res.status(401).send("Access denied");

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ _id: req.params.id });
  if (!user)
    return res.status(404).send("The user with the given id was not found.");

  user = {};
  user = await User.findOne({ name: req.body.name });
  if (user && user.name === req.body.name)
    return res.status(400).send("This user name is already in use.");

  user = {};
  user = await User.findOne({ email: req.body.email });
  if (user && user.email === req.body.email)
    return res.status(400).send("This email is already in use.");

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  const result = await User.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        name: req.body.name,
        email: req.body.email,
        password: password,
        age: req.body.age,
        avatar: req.body.avatar,
        location: req.body.location,
      },
    },
    { new: true }
  );

  const token = result.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(
      _.pick(result, [
        "_id",
        "name",
        "avatar",
        "isAdmin",
        "isGold",
        "location",
        "age",
      ])
    );
});

module.exports = router;
