// middlewares/auth.ts
import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Response, Request } from 'express';
import { JWTCode } from '../constants/code';

const UnauthorizedError = require('../errors/unauthorized-error');

export default
(req: Request & { user?: string | JwtPayload }, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Unauthorized user'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWTCode);
  } catch (e) {
    return next(new UnauthorizedError('Unauthorized user'));
  }

  req.user = payload;
  return next();
};
