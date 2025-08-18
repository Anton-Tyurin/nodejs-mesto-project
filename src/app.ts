import express, { NextFunction, Response } from 'express';
import mongoose from 'mongoose';
import user from './routes/user';
import card from './routes/card';
import { RequestWithUser } from './models/user';

const { PORT = 3000 } = process.env;
const app = express();
app.use(express.json());

app.use((req: RequestWithUser, _: Response, next: NextFunction) => {
  req.user = {
    _id: '689e07e64dc362d638f35095',
  };
  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb');
app.use('/users', user);
app.use('/cards', card);
app.listen(PORT);
