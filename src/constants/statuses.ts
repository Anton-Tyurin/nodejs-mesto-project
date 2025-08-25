export enum ErrorCode {
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  GeneralError = 500,
  ConflictError = 409,
  ValidationError = 11000,
}

export enum SuccessCode {
  Created = 201,
}
