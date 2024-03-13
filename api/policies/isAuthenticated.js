const { jwt, HTTP_STATUS } = require('../../config/constants');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization || req.headers.Authorization; // Extract token from Authorization header

    if (!token) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).send({
        message: req.i18n.__('TOKEN_REQUIRED'),
      });
    }
    // Verify JWT token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const userId = decodedToken.id;

    const user = await User.findOne({ id: userId });

    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).send({
        success: req.i18n.__('SUCCESS_FALSE'),
        message: req.i18n.__('USER_NOT_FOUND'),
      });
    }

    return next();

  } catch (error) {
    return res.status(HTTP_STATUS.BAD_REQUEST).send({
      success: req.i18n.__('SUCCESS_FALSE'),
      message: req.i18n.__('INVALID_TOKEN'),
      error: error.message
    });
  }
};
