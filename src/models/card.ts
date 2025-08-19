// models/user.ts
import { Schema, model } from 'mongoose';

interface ICard {
  name: string;
  link: string;
  owner: Schema.Types.ObjectId;
  likes?: Schema.Types.ObjectId[];
  createdAt?: Date;
}

const cardSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Field "name" is required'],
      minlength: [2, 'Minimum length of the field "name" - 2'],
      maxlength: [30, 'Maximum length of the field "name" - 30'],
    },
    link: {
      type: String,
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
      default: Date.now(),
    },
  },
  { versionKey: false },
);

export default model<ICard>('card', cardSchema);
