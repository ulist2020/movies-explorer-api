const { celebrate, Joi } = require('celebrate');

// eslint-disable-next-line no-useless-escape
const url = /^(https?:\/\/)?(www\.)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/im;

const validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

const validateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().uri().custom((value, helper) => {
      if (!value.match(url)) {
        return helper.message('Invalid value');
      }
      return value;
    }),
    trailer: Joi.string().uri().custom((value, helper) => {
      if (!value.match(url)) {
        return helper.message('Invalid value');
      }
      return value;
    }),
    thumbnail: Joi.string().uri().custom((value, helper) => {
      if (!value.match(url)) {
        return helper.message('Invalid value');
      }
      return value;
    }),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});
const validateIdMovie = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().hex().length(24),
  }),
});
const validateId = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().hex().length(24),
  }),
});
const validateSign = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});
const validateUserRegister = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports = {
  validateUser,
  validateMovie,
  validateIdMovie,
  validateId,
  validateSign,
  validateUserRegister,
};
