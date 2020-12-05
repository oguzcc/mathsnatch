const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User } = require("../models/user");
const { Avatar } = require("../models/avatar");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const validateObjectId = require("../middleware/validateObjectId");

router.post("/:id", [validateObjectId], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  await User.findByIdAndRemove(req.params.id);

  const token = user.generateAuthToken();
  res.header("x-auth-token", token).send();
});

/* router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  const token = user.generateAuthToken();
  res.header("x-auth-token", token).send();
}); */

router.get("/guest", async (req, res) => {
  const date = Date.now();
  const name = "guest" + date.toString();
  const email = name + "@mathsnatch.com";
  const password = date.toString();
  const avatar = "5e4969d45f83cf2170cf7826";

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

  /*   res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    isGold: user.isGold,
    access_token: token,
  }); */

  /*   res.write("_id", user._id);
  res.write("name", user.name);
  res.write("email", user.email);
  res.write("isAdmin", user.isAdmin);
  res.write("isGold", user.isGold);
  res.write("access_token", token);
  res.end(); */

  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email", "isAdmin", "isGold"]));
});

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  };

  return Joi.validate(req, schema);
}

module.exports = router;
