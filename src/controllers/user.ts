import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import User, { RequestWithUser } from '../models/user';
import { SuccessCode } from '../constants/statuses';
import { JWTCode } from '../constants/code';

const NotFoundError = require('../errors/not-found-error');

export const getCurrentUser = (req: RequestWithUser, res: Response, next: NextFunction) => {
  const userId = req?.user?._id || null;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`User with id "${userId}" not found`);
      }
      return res.send({ data: user });
    }).catch(next);
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWTCode, { expiresIn: '7d' });

      res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true });
      return res.send({ data: user });
    }).catch(next);
};

export const getUsers = (_: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch(next);

export const getUser = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`User with id "${userId}" not found`);
      }
      return res.send({ data: user });
    }).catch(next);
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10).then((hash: string) => User.create({
    name, about, avatar, email, password: hash,
  })
    .then((user) => res.status(SuccessCode.Created).send({ data: user }))
    .catch(next));
};

export const updateUser = (req: RequestWithUser, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  const userId = req?.user?._id || null;
  return User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((userById) => {
      if (!userById) {
        throw new NotFoundError(`User with id "${userId}" not found`);
      }
      return res.send({ data: userById });
    }).catch(next);
};

export const updateUserAvatar = (req: RequestWithUser, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  const userId = req?.user?._id || null;
  return User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((userById) => {
      if (!userById) {
        throw new NotFoundError(`User with id "${userId}" not found`);
      }
      return res.send({ data: userById });
    }).catch(next);
};
