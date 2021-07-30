const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
require('dotenv').config();
const cors = require('cors');

const { PORT = 3000 } = process.env;
const bodyParser = require('body-parser');

const app = express();
app.use(cors());

const { requestLogger, errorLogger } = require('./middlewares/logger');
const handlerError = require('./middlewares/handlerError');

const router = require('./routes/index');

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

app.use('/', router);
app.use(errorLogger);

app.use(errors()); // обработчик ошибок celebrate

app.use(handlerError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
