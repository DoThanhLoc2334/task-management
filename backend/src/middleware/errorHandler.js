const errorHandler = (err, req, res, next) => {
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      error: { code: 'DUPLICATE_KEY', message: `${field} đã được sử dụng.` },
    });
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((e) => e.message).join(', ');
    return res.status(422).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message },
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: { code: 'INVALID_ID', message: 'ID không hợp lệ.' },
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Token không hợp lệ.' },
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: { code: 'TOKEN_EXPIRED', message: 'Token đã hết hạn.' },
    });
  }

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      error: { code: err.errorCode, message: err.message },
    });
  }

  console.error('UNHANDLED ERROR:', err);
  res.status(500).json({
    success: false,
    error: { code: 'INTERNAL_ERROR', message: 'Đã có lỗi xảy ra, vui lòng thử lại.' },
  });
};

export default errorHandler;