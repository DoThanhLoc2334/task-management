const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Không tìm thấy route: ${req.method} ${req.originalUrl}`,
    },
  });
};

export default notFoundHandler;