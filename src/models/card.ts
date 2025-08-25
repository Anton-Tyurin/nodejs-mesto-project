import { JwtPayload } from 'jsonwebtoken';
import mongoose, { Schema, model } from 'mongoose';
import { IUser } from './user';
import { URL_REGEXP } from '../constants/regexps';

interface ICard {
  name: string;
  link: string;
  owner: Schema.Types.ObjectId | IUser;
  likes?: Schema.Types.ObjectId[];
  createdAt?: Date;
}

const NotFoundError = require('../errors/not-found-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const BadRequestError = require('../errors/illegal-params-error');

interface CardModel extends mongoose.Model<ICard> {
  checkCardRights: (cardId: string, userId: JwtPayload | null) =>
    Promise<mongoose.Document<unknown, any, ICard>>
}

const cardSchema = new Schema<ICard, CardModel>(
  {
    name: {
      type: String,
      required: [true, 'Field "name" is required'],
      minlength: [2, 'Minimum length of the field "name" - 2'],
      maxlength: [30, 'Maximum length of the field "name" - 30'],
    },
    link: {
      type: String,
      match: [URL_REGEXP, 'invalid url'],
      required: [true, 'Field "link" is required'],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: [true, 'Field "owner" is required'],
    },
    likes: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

cardSchema.static('checkCardRights', function checkCardRights(cardId: string, userId: string) {
  if (!mongoose.isValidObjectId(cardId)) {
    throw new BadRequestError('Invalid cardId format');
  }
  if (!mongoose.isValidObjectId(userId)) {
    throw new BadRequestError('Invalid userId format');
  }
  return this.findOne({ cardId })
    .then((card) => {
      const owner = card?.owner as IUser;
      if (!card) {
        throw new NotFoundError(`Card with id "${cardId}" not found`);
      }
      if (owner._id.toString() !== userId) {
        throw new UnauthorizedError('User has not rights to delete card');
      }
      return card;
    });
});

export default model<ICard, CardModel>('card', cardSchema);
