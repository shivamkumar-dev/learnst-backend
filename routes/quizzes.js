const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Level } = require('../models/level');
const { Category } = require('../models/category');
const { Quiz, validate } = require('../models/quiz');
const router = require('express').Router();

// Get All Quizzes
router.get('/', async (req, res) => {
  const quizzes = await Quiz.find();
  res.send(quizzes);
});

// Post a New Quiz
router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = await Category.findById(req.body.categoryId);
  if (!category) return res.status(400).send('Invalid Category');

  const level = await Level.findById(req.body.levelId);
  if (!level) return res.status(400).send('Invalid Level');

  const quiz = new Quiz({
    title: req.body.title,
    quiz: req.body.quiz,
    category: {
      _id: category._id,
      name: category.name,
    },
    level: {
      _id: level._id,
      name: level.name,
    },
  });
  await quiz.save();

  res.send(quiz);
});

// Update an existing Quiz
router.put('/:id', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = await Category.findById(req.body.categoryId);
  if (!category) return res.status(400).send('Invalid Category');

  const level = await Level.findById(req.body.levelId);
  if (!level) return res.status(400).send('Invalid Level');

  const quiz = await Quiz.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      quiz: req.body.quiz,
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

  if (!quiz)
    return res.status(400).send('The Movie with the given ID was not found');

  res.send(quiz);
});

// Delete an existing Quiz
router.delete('/:id', [auth, admin], async (req, res) => {
  const quiz = await Quiz.findByIdAndRemove(req.params.id);

  if (!quiz)
    return res.status(400).send('The Quiz with the given ID was not found');

  res.send(quiz);
});

// Get a Single Quiz
router.get('/:id', async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);

  if (!quiz)
    return res.status(400).send('The Quiz with the given ID was not found');

  res.send(quiz);
});

module.exports = router;
