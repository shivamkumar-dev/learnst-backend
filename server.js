require('express-async-errors');
const cors = require('./middleware/cors');
const error = require('./middleware/error');
const quizzes = require('./routes/quizzes');
const resources = require('./routes/resources');
const categories = require('./routes/categories');
const levels = require('./routes/levels');
const users = require('./routes/users');
const auth = require('./routes/auth');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const compression = require('compression');
const express = require('express');
const helmet = require('helmet');
const app = express();
require('dotenv').config();

// Database connection
mongoose
  .connect(process.env.DB_CONN, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log('Connected to database...'))
  .catch((err) =>
    console.error(`Error connecting to the database. \n${err.message}`)
  );

// Middlewares
app.use(express.json());
app.use('/api/levels', levels);
app.use('/api/categories', categories);
app.use('/api/resources', resources);
app.use('/api/quizzes', quizzes);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use(cors);
app.use(error);
app.use(helmet());
app.use(compression());

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
