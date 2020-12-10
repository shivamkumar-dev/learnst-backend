const Joi = require('joi');
const mongoose = require('mongoose');

// Level Schema
const levelSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true,
    trim: true,
  },
});

const Level = mongoose.model('Level', levelSchema);

// Level Validator
const validateLevel = (level) => {
  const schema = Joi.object({
    name: Joi.string().min(6).max(15).required(),
  });

  return schema.validate(level);
};

exports.levelSchema = levelSchema;
exports.Level = Level;
exports.validate = validateLevel;
