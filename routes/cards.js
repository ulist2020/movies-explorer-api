const router = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const { validateCard, validateIdCard } = require('../middlewares/validation');

router.get('/cards', getCards);
router.post('/cards', validateCard, createCard);
router.delete('/cards/:cardId', validateIdCard, deleteCard);
router.put('/cards/:cardId/likes', validateIdCard, likeCard);
router.delete('/cards/:cardId/likes', validateIdCard, dislikeCard);

module.exports = router;
