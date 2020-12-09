const { levelSchema } = require('../models/level');
const { categorySchema } = require('../models/category');
const Joi = require('joi');
const mongoose = require('mongoose');

// Resource Schema
const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
    trim: true,
  },
  resourceUrl: {
    type: String,
    required: true,
  },
  coverUrl: {
    type: String,
    required: true,
  },
  category: {
    type: categorySchema,
    required: true,
  },
  level: {
    type: levelSchema,
    required: true,
  },
});

const Resource = mongoose.model('Resource', resourceSchema);

// Resource Validator
const validateResource = (resource) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(255).required(),
    resourceUrl: Joi.string().required(),
    coverUrl: Joi.string().required(),
    categoryId: Joi.objectId().required(),
    levelId: Joi.objectId().required(),
  });

  return schema.validate(resource);
};

exports.Resource = Resource;
exports.validate = validateResource;
