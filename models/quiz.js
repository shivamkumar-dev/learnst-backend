const { levelSchema } = require('../models/level');
const { categorySchema } = require('../models/category');
const Joi = require('joi');
const mongoose = require('mongoose');

// Question Schema
questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: {
    type: Array,
    required: true,
    validate: {
      validator: function (v) {
        return v && v.length > 1;
      },
      message: 'Minimum 2 option is required.',
    },
  },
  answer: { type: String, required: true },
});

// Quiz Schema
const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
    trim: true,
  },
  quiz: [questionSchema],
  category: {
    type: categorySchema,
    required: true,
  },
  level: {
    type: levelSchema,
    required: true,
  },
});

const Quiz = mongoose.model('Quiz', quizSchema);

// Quiz Validator
const validateQuiz = (quiz) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(255).required(),
    quiz: Joi.array()
      .min(1)
      .items(
        Joi.object().keys({
          question: Joi.string().required(),
          options: Joi.array().min(2).items(Joi.string()),
          answer: Joi.string().required(),
        })
      ),
    categoryId: Joi.objectId().required(),
    levelId: Joi.objectId().required(),
  });

  return schema.validate(quiz);
};

exports.Quiz = Quiz;
exports.validate = validateQuiz;
