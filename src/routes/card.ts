import { Router } from 'express';
import {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} from '../controllers/card';

const { celebrate, Joi } = require('celebrate');

const router = Router();

router.get('/', celebrate({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(),
}), getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri(),
  }),
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(),
}), createCard);
router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().required(),
  }),
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(),
}), deleteCard);
router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().required(),
  }),
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(),
}), likeCard);
router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().required(),
  }),
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(),
}), dislikeCard);

export default router;
