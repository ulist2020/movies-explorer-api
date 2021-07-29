const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const Forbidden = require('../errors/forbidden-error');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .populate('user')
    .then((movies) => res.status(200).send(movies))
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
    .then((movie) => res.status(200).send({ movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => {
      throw new NotFoundError('Фильм с указанным _id не найден');
    })
    .then((movie) => {
      if (movie.owner._id.toString() === req.user._id) {
        Movie.findByIdAndRemove(req.params.movieId)
          // eslint-disable-next-line no-shadow
          .then((movie) => {
            res.send(movie);
          })
          .catch((err) => {
            if (err.name === 'CastError') {
              throw new BadRequestError('Переданы некорректные данные для удаления фильма');
            }
          })
          .catch(next);
      } else {
        throw new Forbidden('Вы не можете удалять фильмы других пользователей');
      }
      return res.status(200).send({ message: 'Фильм удален' });
    })
    .catch(next);
};