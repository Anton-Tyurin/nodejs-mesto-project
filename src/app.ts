import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import { celebrate, Joi } from 'celebrate';
import user from './routes/user';
import card from './routes/card';
import { requestLogger, errorLogger } from './middlewares/logger';
import { createUser, login } from './controllers/user';
import auth from './middlewares/auth';
import errorHandler from './middlewares/errorsHandler';

const { errors: celebrateErrorsHandler } = require('celebrate');
const NotFoundError = require('./errors/not-found-error');

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
    avatar: Joi.string().uri(),
  }),
}), createUser);

app.use(auth);

app.use('/users', user);
app.use('/cards', card);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Url not found'));
});

app.use(errorLogger);
app.use(celebrateErrorsHandler());
app.use(errorHandler);

app.listen(PORT);
