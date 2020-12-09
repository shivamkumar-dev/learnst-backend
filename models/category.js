const Joi = require('joi');
const mongoose = require('mongoose');

// Category Schema
const categorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
    trim: true,
  },
});

const Category = mongoose.model('Category', categorySchema);

// Category Validator
const validateCategory = (category) => {
  const schema = Joi.object({
    category: Joi.string().min(3).max(50).required(),
  });

  return schema.validate(category);
};

exports.categorySchema = categorySchema;
exports.Category = Category;
exports.validate = validateCategory;
