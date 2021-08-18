const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

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
      if (validator.isURL(value)) {
        return value;
      }
      return helper.message('Неправилный URL');
    }),
    trailer: Joi.string().uri().custom((value, helper) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helper.message('Неправилный URL');
    }),
    thumbnail: Joi.string().uri().custom((value, helper) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helper.message('Неправилный URL');
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
    name: Joi.string().required().min(2).max(30),
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
