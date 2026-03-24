export const successResponse = (res, data = null, message = 'Success') => {
    return res.status(200).json({
      success: true,
      data,
      message
    });
  };
  
  export const errorResponse = (res, message = 'Error', status = 500) => {
    return res.status(status).json({
      success: false,
      message
    });
  };