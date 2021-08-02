const router = require('express').Router();

const { createUser, login } = require('../controllers/users');
const usersRoutes = require('./users');
const moviesRoutes = require('./movie');
const auth = require('../middlewares/auth');
const { validateSign, validateUserRegister } = require('../middlewares/validation');
const NotFoundError = require('../errors/not-found-error');

router.post('/signup', validateUserRegister, createUser);
router.post('/signin', validateSign, login);

router.use('/', auth, usersRoutes);
router.use('/', auth, moviesRoutes);

router.use('/', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

module.exports = router;
