const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Level } = require('../models/level');
const { Category } = require('../models/category');
const { Resource, validate } = require('../models/resource');
const router = require('express').Router();

// Get All Resources
router.get('/', async (req, res) => {
  const resources = await Resource.find();
  res.send(resources);
});

// Post a New Resource
//[auth, admin],
router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = await Category.findById(req.body.categoryId);
  if (!category) return res.status(400).send('Invalid Category');

  const level = await Level.findById(req.body.levelId);
  if (!level) return res.status(400).send('Invalid Level');

  const resource = new Resource({
    title: req.body.title,
    resourceUrl: req.body.resourceUrl,
    coverUrl: req.body.coverUrl,
    category: {
      _id: category._id,
      name: category.name,
    },
    level: {
      _id: level._id,
      name: level.name,
    },
  });
  await resource.save();

  res.send(resource);
});

// Update an existing Resource
//[auth, admin],
router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = await Category.findById(req.body.categoryId);
  if (!category) return res.status(400).send('Invalid Category');

  const level = await Level.findById(req.body.levelId);
  if (!level) return res.status(400).send('Invalid Level');

  const resource = await Resource.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      resourceUrl: req.body.resourceUrl,
      coverUrl: req.body.coverUrl,
      category: {
        _id: category._id,
        name: category.name,
      },
      level: {
        _id: level._id,
        name: level.name,
      },
    },
    { new: true }
  );

  if (!resource)
    return res.status(400).send('The Resource with the given ID was not found');

  res.send(resource);
});

// Delete an existing Resource
// [auth, admin],
router.delete('/:id', async (req, res) => {
  const resource = await Resource.findByIdAndRemove(req.params.id);

  if (!resource)
    return res.status(400).send('The Resource with the given ID was not found');

  res.send(resource);
});

// Get a Single Resource
router.get('/:id', async (req, res) => {
  const resource = await Resource.findById(req.params.id);

  if (!resource)
    return res.status(400).send('The Resource with the given ID was not found');

  res.send(resource);
});

module.exports = router;
