const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User } = require('../models/user');
const Joi = require('joi');
const router = require('express').Router();

// User Authentication
router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid User or Password.');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid User or Password');

  const token = user.generateAuthToken();
  res.send(token);
});

// User Validator
const validate = (user) => {
  const schema = Joi.object({
    email: Joi.string().max(255).required().email(),
    password: Joi.string().max(1024).required(),
  });

  return schema.validate(user);
};

module.exports = router;
