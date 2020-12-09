const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Level, validate } = require('../models/level');
const router = require('express').Router();

router.get('/', async (req, res) => {
  const levels = await Level.find().sort('level');
  res.send(levels);
});

router.post('/', [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const level = new Level({ level: req.body.level });
  await level.save();

  res.send(level);
});

router.put('/:id', [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const level = await Level.findByIdAndUpdate(
    req.params.id,
    {
      level: req.body.level,
    },
    { new: true }
  );

  if (!level)
    return res.status(400).send('The Level with the given ID was not found');

  res.send(level);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  const level = await Level.findByIdAndRemove(req.params.id);

  if (!level)
    return res.status(400).send('The Level with the given ID was not found');

  res.send(category);
});

router.get('/:id', async (req, res) => {
  const level = await Level.findById(req.params.id);

  if (!level)
    return res.status(400).send('The Level with the given ID was not found');

  res.send(level);
});

module.exports = router;
