import { Request, Response } from 'express';
import { RequestWithUser } from '../models/user';
import Card from '../models/card';
import { ErrorCode } from '../constants/errors';

export const getCards = (_: Request, res: Response) => Card.find({})
  .then((cards) => res.send({ data: cards }))
  .catch(() => res.status(ErrorCode.GeneralError).send({ message: 'Server Error' }));

export const createCard = (req: RequestWithUser, res: Response) => {
  const { name, link } = req.body;
  const { user } = req as RequestWithUser;
  return Card.create({ name, link, owner: user?._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ErrorCode.BadRequest).send({ message: 'Illegal request parameters' });
      }
      return res.status(ErrorCode.GeneralError).send({ message: 'Server Error' });
    });
};
export const deleteCard = (req: RequestWithUser, res: Response) => {
  const { cardId } = req.params;
  return Card.deleteOne({ _id: cardId })
    .then((card) => {
      if (!card) {
        const error: NodeJS.ErrnoException = new Error(`Card with id "${req?.user?._id}" not found`);
        error.code = '404';
        return Promise.reject(error);
      }
      return res.send({ data: card });
    })
    .catch((err: NodeJS.ErrnoException) => {
      if (Number(err.code) === ErrorCode.NotFound) {
        return res.status(ErrorCode.NotFound).send({ message: err.message });
      }
      if (err.name === 'ValidationError') {
        return res.status(ErrorCode.BadRequest).send({ message: 'Illegal request parameters' });
      }
      return res.status(ErrorCode.GeneralError).send({ message: 'Server Error' });
    });
};

export const likeCard = (req: RequestWithUser, res: Response) => {
  const { cardId } = req.params;
  const { user } = req as RequestWithUser;

  return Card.findByIdAndUpdate(cardId, { $addToSet: { likes: user?._id } }, { new: true })
    .then((card) => {
      if (!card) {
        const error: NodeJS.ErrnoException = new Error(`Card with id "${req?.user?._id}" not found`);
        error.code = '404';
        return Promise.reject(error);
      }
      return res.send({ data: card });
    })
    .catch((err: NodeJS.ErrnoException) => {
      if (Number(err.code) === ErrorCode.NotFound) {
        return res.status(ErrorCode.NotFound).send({ message: err.message });
      }
      if (err.name === 'ValidationError') {
        return res.status(ErrorCode.BadRequest).send({ message: 'Illegal request parameters' });
      }
      return res.status(ErrorCode.GeneralError).send({ message: 'Server Error' });
    });
};

export const dislikeCard = (req: RequestWithUser, res: Response) => {
  const { cardId } = req.params;
  const { user } = req as RequestWithUser;

  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: user?._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        const error: NodeJS.ErrnoException = new Error(`Card with id "${req?.user?._id}" not found`);
        error.code = '404';
        return Promise.reject(error);
      }
      return res.send({ data: card });
    })
    .catch((err: NodeJS.ErrnoException) => {
      if (Number(err.code) === ErrorCode.NotFound) {
        return res.status(ErrorCode.NotFound).send({ message: err.message });
      }
      if (err.name === 'ValidationError') {
        return res.status(ErrorCode.BadRequest).send({ message: 'Illegal request parameters' });
      }
      return res.status(ErrorCode.GeneralError).send({ message: 'Server Error' });
    });
};
