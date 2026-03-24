class AppError extends Error {
  constructor(code, statusCode = 400, message = '') {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
  }
}

export default AppError;