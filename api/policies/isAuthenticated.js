const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization; // Extract token from Authorization header

    if (!token) {
      return res.status(401).send({
        message: 'Login required!!',
        error: [
          "No token provided",
          "Please provide a token in the headers with 'Authorization' key"
        ]
      });
    }

    // Verify JWT token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const userId = decodedToken.id;

    const user = await User.findOne({ id: userId })

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User Not Found!",
      })
    }

    next();

  } catch (error) {
    return res.status(401).send({ error: 'Invalid token' });
  }
};
