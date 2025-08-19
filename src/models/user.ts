import { Schema, model } from 'mongoose';
import { Request } from 'express';

export interface IUser {
  name: string;
  about: string;
  avatar: string;
}

// temporary
export interface RequestWithUser extends Request {
  user?: Partial<IUser> & { _id: string };
}

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Field "name" is required'],
      minlength: [2, 'Minimum length of the field "name" - 2'],
      maxlength: [30, 'Maximum length of the field "name" - 30'],
    },
    about: {
      type: String,
      required: [true, 'Field "about" is required'],
      minlength: [2, 'Minimum length of the field "about" - 2'],
      maxlength: [200, 'Maximum length of the field "about" - 200'],
    },
    avatar: {
      type: String,
      required: [true, 'Field "avatar" is required'],
    },
  },
  { versionKey: false },
);

export default model<IUser>('user', userSchema);
