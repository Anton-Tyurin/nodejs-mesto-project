// @ts-ignore

import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { ErrorWithStatusCode } from '../errors';
import { ErrorCode } from '../constants/statuses';

export default
(err: ErrorWithStatusCode &
  { code?: number }, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = ErrorCode.GeneralError, message } = err;
  if (err.statusCode === ErrorCode.BadRequest) {
    res
      .status(ErrorCode.BadRequest)
      .send({ message: err.message || 'Bad Request' });
  } else {
    res
      .status(statusCode)
      .send({
        message: statusCode === ErrorCode.GeneralError
          ? 'Internal Server Error'
          : message,
      });
  }
};
