const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
require('dotenv').config();
const cors = require('cors');

const { PORT = 3000 } = process.env;
const bodyParser = require('body-parser');

const app = express();
app.use(cors());

const { createUser, login } = require('./controllers/users');
const usersRoutes = require('./routes/users');
const moviesRoutes = require('./routes/movie');
const auth = require('./middlewares/auth');
const { validateSign, validateUserRegister } = require('./middlewares/validation');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/not-found-error');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signup', validateUserRegister, createUser);
app.post('/signin', validateSign, login);

app.use('/', auth, usersRoutes);
app.use('/', auth, moviesRoutes);

app.use('/', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.use(errorLogger);

app.use(errors()); // обработчик ошибок celebrate

app.use((err, req, res, next) => {
  const { status = 500, message } = err;
  res.status(status).send({
    message: status === 500 ? 'На сервере произошла ошибка' : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
