import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import { celebrate, Joi } from 'celebrate';
import user from './routes/user';
import card from './routes/card';
import { requestLogger, errorLogger } from './middlewares/logger';
import { ErrorWithStatusCode } from './errors';
import { ErrorCode } from './constants/statuses';
import { createUser, login } from './controllers/user';
import auth from './middlewares/auth';

const { errors } = require('celebrate');

const { PORT = 3000 } = process.env;
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  ipv6Subnet: 56,
});

app.use(limiter);
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestodb');
app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string(),
  }),
}), createUser);

app.use(auth);

app.use('/users', user);
app.use('/cards', card);
app.use(errorLogger);

app.use(errors());

app.use((err: ErrorWithStatusCode &
  { code?: number }, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = ErrorCode.GeneralError, message } = err;

  if (err.code === ErrorCode.ValidationError) {
    res
      .status(ErrorCode.ConflictError)
      .send({ message: 'This email already exists' });
  }

  res
    .status(statusCode)
    .send({
      message: statusCode === ErrorCode.GeneralError
        ? 'Internal Server Error'
        : message,
    });
});

app.listen(PORT);
