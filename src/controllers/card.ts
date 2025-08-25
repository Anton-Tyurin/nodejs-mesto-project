import { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Card from '../models/card';
import { SuccessCode } from '../constants/statuses';

const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/illegal-params-error');

export const getCards = (_: Request, res: Response, next: NextFunction) => Card.find({})
  .then((cards) => res.send({ data: cards }))
  .catch(next);

export const createCard = (req: Request &
  { user?: { _id: JwtPayload }}, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const userId = req?.user?._id || null;
  return Card.create({ name, link, owner: userId })
    .then((card) => res.status(SuccessCode.Created).send({ data: card }))
    .catch(next);
};
export const deleteCard = (req: Request &
  { user?: { _id: JwtPayload }}, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req?.user?._id || null;
  return Card.checkCardRights(cardId, userId)
    .then((card) => Card.deleteOne({ _id: card._id })).then((card) => {
      res.send({ data: card });
    })
    .catch(next);
};

export const likeCard = (req: Request &
  { user?: { _id: JwtPayload }}, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req?.user?._id || null;

  try {
    if (!mongoose.isValidObjectId(cardId)) {
      throw new BadRequestError('Invalid cardId format');
    }
  } catch (err) {
    return next(err);
  }

  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Card with id "${cardId}" not found`);
      }
      return res.send({ data: card });
    })
    .catch(next);
};

export const dislikeCard = (req: Request &
  { user?: { _id: JwtPayload }}, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req?.user?._id || null;

  try {
    if (!mongoose.isValidObjectId(cardId)) {
      throw new BadRequestError('Invalid cardId format');
    }
  } catch (err) {
    return next(err);
  }

  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Card with id "${cardId}" not found`);
      }
      return res.send({ data: card });
    })
    .catch(next);
};
