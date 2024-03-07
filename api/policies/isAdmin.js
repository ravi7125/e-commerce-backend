const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization || req.headers.Authorization; // Extract token from Authorization header

    if (!token) {
      return res.status(401).send({
        message: 'Login required!!',
        error: [
          'No token provided',
          'Please provide a token in the headers with \'Authorization\' key'
        ]
      });
    }

    // Verify JWT token
    // const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const userId = decodedToken.id;

    const user = await User.findOne({ id: userId });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'User Not Found!',
      });
    }

    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: 'UnAuthorized Access, You Not Admin'
      });
    }

    return next();

  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      message: 'Error in Admin Middleware',
      error: error.message
    });
  }
};
