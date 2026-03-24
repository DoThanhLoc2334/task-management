import { ERROR_CODES } from './errorCodes.js';

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.code) {
    return res.status(err.statusCode || 400).json({
      success: false,
      code: err.code,
      message: err.message || err.code
    });
  }

  return res.status(500).json({
    success: false,
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Something went wrong'
  });
};

export default errorHandler;