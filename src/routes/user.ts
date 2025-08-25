import { Router } from 'express';
import {
  getUser,
  getUsers,
  updateUser,
  updateUserAvatar,
  getCurrentUser,
} from '../controllers/user';

const { celebrate, Joi } = require('celebrate');

const router = Router();

router.get(
  '/',
  celebrate({
    headers: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
  }),
  getUsers,
);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum(),
  }),
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(),
}), getUser);
router.patch('/me', celebrate({
  body: {
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
  },
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(),
}), updateUser);
router.get(
  '/me',
  celebrate({
    body: {
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(200),
    },
    headers: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
  }),
  getCurrentUser,
);
router.patch('/me/avatar', celebrate({
  body: {
    avatar: Joi.string(),
  },
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(),
}), updateUserAvatar);

export default router;
