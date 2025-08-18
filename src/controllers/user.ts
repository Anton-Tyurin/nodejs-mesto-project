import { Request, Response } from 'express';

import User, { RequestWithUser } from '../models/user';
import { ErrorCode } from '../constants/errors';

export const getUsers = (_: Request, res: Response) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch(() => res.status(ErrorCode.GeneralError).send({ message: 'Server Error' }));

export const getUser = (req: Request, res: Response) => {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        const error: NodeJS.ErrnoException = new Error(`User with id "${userId}" not found`);
        error.code = '404';
        return Promise.reject(error);
      }
      return res.send({ data: user });
    })
    .catch((err: NodeJS.ErrnoException) => {
      if (Number(err.code) === ErrorCode.NotFound) {
        return res.status(ErrorCode.NotFound).send({ message: err.message });
      }
      return res.status(ErrorCode.GeneralError).send({ message: 'Server Error' });
    });
};

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ErrorCode.BadRequest).send({ message: 'Illegal request parameters' });
      }
      return res.status(ErrorCode.GeneralError).send({ message: 'Server Error' });
    });
};

export const updateUser = (req: RequestWithUser, res: Response) => {
  const { name, about } = req.body;
  const { user } = req as RequestWithUser;
  return User.findByIdAndUpdate(user?._id, { name, about }, { new: true })
    .then((userById) => {
      if (!name && !about) {
        const error: NodeJS.ErrnoException = new Error('Illegal request parameters');
        error.code = '400';
        return Promise.reject(error);
      }
      if (!userById) {
        const error: NodeJS.ErrnoException = new Error(`User with id "${req.user?._id}" not found`);
        error.code = '404';
        return Promise.reject(error);
      }
      return res.send({ data: userById });
    })
    .catch((err: NodeJS.ErrnoException) => {
      if (Number(err.code) === ErrorCode.NotFound) {
        return res.status(ErrorCode.NotFound).send({ message: err.message });
      }
      if (err.name === 'ValidationError') {
        return res.status(ErrorCode.BadRequest).send({ message: err.message });
      }
      return res.status(ErrorCode.GeneralError).send({ message: 'Server Error' });
    });
};

export const updateUserAvatar = (req: RequestWithUser, res: Response) => {
  const { avatar } = req.body;
  const { user } = req as RequestWithUser;
  return User.findByIdAndUpdate(user?._id, { avatar }, { new: true })
    .then((userById) => {
      if (!avatar) {
        const error: NodeJS.ErrnoException = new Error('Illegal request parameters');
        error.code = '400';
        return Promise.reject(error);
      }
      if (!userById) {
        const error: NodeJS.ErrnoException = new Error(`User with id "${req.user?._id}" not found`);
        error.code = '404';
        return Promise.reject(error);
      }
      return res.send({ data: userById });
    })
    .catch((err: NodeJS.ErrnoException) => {
      if (Number(err.code) === ErrorCode.NotFound) {
        return res.status(ErrorCode.NotFound).send({ message: err.message });
      }
      if (err.name === 'ValidationError') {
        return res.status(ErrorCode.BadRequest).send({ message: err.message });
      }
      return res.status(ErrorCode.GeneralError).send({ message: 'Server Error' });
    });
};
