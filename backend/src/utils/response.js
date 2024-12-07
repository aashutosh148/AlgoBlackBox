function getErrorResponse(message) {
  return {
    success: false,
    statusCode: 404,
    message
  };
}
function getSuccessResponse(message, data) {
  return {
    sucess: true,
    statusCode: 200,
    message,
    data
  };
}
export { getErrorResponse, getSuccessResponse };
