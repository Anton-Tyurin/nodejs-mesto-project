import mongoose, { Schema, model } from 'mongoose';
import { Request } from 'express';
import validator from 'validator';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from 'jsonwebtoken';
import { URL_REGEXP } from '../constants/regexps';

const NotFoundError = require('../errors/not-found-error');
const UnauthorizedError = require('../errors/unauthorized-error');

export interface IUser {
  _id: string;
  name?: string;
  about?: string;
  avatar?: string;
  email: string;
  password: string;
}

interface UserModel extends mongoose.Model<IUser> {
  findUserByCredentials: (email: string, password: string) =>
    Promise<mongoose.Document<unknown, any, IUser>>,
  checkProfileRights: (profileId: string, requestUserId: string) =>
    Promise<mongoose.Document<unknown, any, IUser>>
}

export interface RequestWithUser extends Request {
  user?: Partial<IUser> & { _id: JwtPayload };
}

const userSchema = new Schema<IUser, UserModel>(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: 'Email validation failed',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      minlength: [2, 'Minimum length of the field "name" - 2'],
      maxlength: [30, 'Maximum length of the field "name" - 30'],
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: [2, 'Minimum length of the field "about" - 2'],
      maxlength: [200, 'Maximum length of the field "about" - 200'],
      default: 'Исследователь',
    },
    avatar: {
      match: [URL_REGEXP, 'invalid url'],
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
  },
  { versionKey: false },
);

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User Not Found');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Unauthorized');
          }
          return user;
        });
    });
});

export default model<IUser, UserModel>('user', userSchema);
