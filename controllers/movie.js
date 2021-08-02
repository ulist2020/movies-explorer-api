const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const Forbidden = require('../errors/forbidden-error');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .populate('user')
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.send({ movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => {
      throw new NotFoundError('Фильм с указанным _id не найден');
    })
    .then((movie) => {
      if (movie.owner._id.toString() === req.user._id) {
        return movie;
      }
      return next(new Forbidden('Вы не можете удалять фильмы других пользователей'));
    })
    .then((movie) => movie.remove().then(() => res.send({ message: 'Фильм удален' })))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для удаления фильма'));
      } else {
        next(err);
      }
    });
};
