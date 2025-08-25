class UnauthorizedError extends Error {
  private statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 403;
  }
}
module.exports = UnauthorizedError;
