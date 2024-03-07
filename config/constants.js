module.exports = {
  HTTP_STATUS: {
    SUCCESS: 200,
    CREATED: 201,
    ALREADY_EXISTS: 203,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
    FORBIDDEN: 403
  },
  bcrypt: require('bcrypt'),
  jwt: require('jsonwebtoken'),
  slugify: require('slugify'),
};
