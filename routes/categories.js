const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Category, validate } = require('../models/category');
const router = require('express').Router();

router.get('/', async (req, res) => {
  const categories = await Category.find().sort('category');
  res.send(categories);
});

router.post('/', [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = new Category({ category: req.body.category });
  await category.save();

  res.send(category);
});

router.put('/:id', [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      category: req.body.category,
    },
    { new: true }
  );

  if (!category)
    return res.status(400).send('The Category with the given ID was not found');

  res.send(category);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  const category = await Category.findByIdAndRemove(req.params.id);

  if (!category)
    return res.status(400).send('The Category with the given ID was not found');

  res.send(category);
});

router.get('/:id', async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category)
    return res.status(400).send('The Category with the given ID was not found');

  res.send(category);
});

module.exports = router;
