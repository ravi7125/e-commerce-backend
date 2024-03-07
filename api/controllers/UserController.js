/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const { bcrypt, jwt, HTTP_STATUS } = require('../../config/constants');

module.exports = {

  signup: async (req, res) => {

    try {
      const { username, email, password, answer, address, role } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      if (!username || !email || !password || !answer || !address) {
        return res.status(HTTP_STATUS.BAD_REQUEST).send({
          message: req.i18n.__('REQUIRED')
        });
      }

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(HTTP_STATUS.ALREADY_EXISTS).send({
          success: req.i18n.__('SUCCESS_FALSE'),
          message: req.i18n.__('ALREADY_EXISTS_EMAIL'),
        });
      }

      const user = await User.create({ username, email, password: hashedPassword, answer, role, address });

      return res.status(HTTP_STATUS.SUCCESS).send({
        success: req.i18n.__('SUCCESS_TRUE'),
        message: req.i18n.__('SIGNUP'),
        user
      });

    } catch (error) {
      return res.status(HTTP_STATUS.SERVER_ERROR).send({
        success: req.i18n.__('SUCCESS_FALSE'),
        message: req.i18n.__('SERVER_ERROR_USER'),
        error: error.message,
      });

    }

  },

  login: async (req, res) => {

    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(HTTP_STATUS.BAD_REQUEST).send({
          message: req.i18n.__('REQUIRED')
        });
      }

      const existingUser = await User.findOne({ email });

      if (!existingUser) {
        return res.status(HTTP_STATUS.NOT_FOUND).send({
          success: req.i18n.__('SUCCESS_FALSE'),
          message: req.i18n.__('USER_NOT_FOUND'),
        });

      }

      const match = await bcrypt.compare(password, existingUser.password);

      if (!match) {
        return res.status(HTTP_STATUS.NOT_FOUND).send({
          success: req.i18n.__('SUCCESS_FALSE'),
          message: req.i18n.__('INVALID_PASSWORD'),
        });
      }

      const token = jwt.sign({ id: existingUser.id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });

      return res.status(HTTP_STATUS.SUCCESS).send({
        success: req.i18n.__('SUCCESS_TRUE'),
        message: req.i18n.__('LOGIN'),
        user: {
          id: existingUser.id,
          username: existingUser.username,
          email: existingUser.email,
        },
        token,
      });


    } catch (error) {
      return res.status(HTTP_STATUS.SERVER_ERROR).send({
        success: req.i18n.__('SUCCESS_FALSE'),
        message: req.i18n.__('SERVER_ERROR_USER'),
        error: error.message,
      });

    }

  },

  forgot: async (req, res) => {

    try {

      const { email, answer, newPassword } = req.body;

      if (!email || !answer || !newPassword) {
        return res.status(HTTP_STATUS.BAD_REQUEST).send({
          message: req.i18n.__('REQUIRED')
        });
      }

      const user = await User.findOne({ email, answer });

      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).send({
          success: req.i18n.__('SUCCESS_FALSE'),
          message: req.i18n.__('INVALID_CREDENTIALS')
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await User.update({ password: user.password }).set({ password: hashedPassword });

      return res.status(HTTP_STATUS.SUCCESS).send({
        success: req.i18n.__('SUCCESS_TRUE'),
        message: req.i18n.__('PASSWORD_RESETED'),
      });


    } catch (error) {
      return res.status(HTTP_STATUS.SERVER_ERROR).send({
        success: req.i18n.__('SUCCESS_FALSE'),
        message: req.i18n.__('SERVER_ERROR_USER'),
        error
      });

    }

  },

  find: async (req, res) => {
    try {

      const users = await User.find({});

      res.status(HTTP_STATUS.SUCCESS).send({
        success: req.i18n.__('SUCCESS_TRUE'),
        countTotal: users.length,
        message: req.i18n.__('FETCHED_USRES'),
        users,
      });
    } catch (error) {
      res.status(HTTP_STATUS.SERVER_ERROR).send({
        success: req.i18n.__('SUCCESS_FALSE'),
        message: req.i18n.__('SERVER_ERROR_USER'),
        error: error.message,
      });
    }
  },

  findOne: async (req, res) => {
    try {

      const id = req.params.id;

      const user = await User.findOne({ id });

      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).send({
          success: req.i18n.__('SUCCESS_FALSE'),
          message: req.i18n.__('USER_NOT_FOUND'),
        });
      }

      res.status(HTTP_STATUS.SUCCESS).send({
        success: req.i18n.__('SUCCESS_TRUE'),
        message: req.i18n.__('SINGLE_USER'),
        user,
      });

    } catch (error) {
      res.status(HTTP_STATUS.SERVER_ERROR).send({
        success: req.i18n.__('SUCCESS_FALSE'),
        message: req.i18n.__('SERVER_ERROR_USER'),
        error: error.message,
      });
    }
  },


  listUsers: async (req, res) => {

    const page = req.query.page || 1; // Current page number
    const perPage = req.query.perPage || 1; // Number of items per page

    const skip = (page - 1) * perPage; // Calculate the number of items to skip
    const limit = perPage; // Limit the number of items per page

    try {

      const users = await User.find({})
                .skip(skip)
                .limit(limit);

      if (users.length <= 0) {
        res.status(HTTP_STATUS.SUCCESS).send({
          success: req.i18n.__('SUCCESS_TRUE'),
          message: req.i18n.__('USER_NOT_FOUND_PAGE'),
        });
      }

      return res.status(HTTP_STATUS.SUCCESS).send({
        success: req.i18n.__('SUCCESS_TRUE'),
        message: req.i18n.__('FETCHED_USERS'),
        users
      });

    } catch (error) {
      return res.serverError(error);
    }
  },


  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const findUser = await User.findOne({ id });

      if (!findUser) {
        return res.status(HTTP_STATUS.NOT_FOUND).send({
          success: req.i18n.__('SUCCESS_FALSE'),
          message: req.i18n.__('USER_NOT_FOUND'),
        });
      }

      const deletedCart = await Cart.destroyOne({ userid: id });

      const deletedUser = await User.destroyOne({ id });

      res.status(HTTP_STATUS.SUCCESS).send({
        success: req.i18n.__('SUCCESS_TRUE'),
        message: req.i18n.__('USER_DELETED'),
        deletedCart,
        deletedUser,
      });

    } catch (error) {
      res.status(HTTP_STATUS.SERVER_ERROR).send({
        success: req.i18n.__('SUCCESS_FALSE'),
        message: req.i18n.__('SERVER_ERROR_USER'),
        error: error.message,
      });
    }
  },

};

