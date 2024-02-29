/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */




const { bcrypt, jwt, HTTP_STATUS } = require('../../config/constants')

module.exports = {

    signup: async (req, res) => {

        try {
            const { username, email, password, answer, address, role } = req.body;

            const hashedPassword = await bcrypt.hash(password, 10);


            if (!username || !email || !password || !answer || !address) {
                return res.status(HTTP_STATUS.BAD_REQUEST).send({
                    message: "All Fields are requied to fill"
                })
            }

            const existingUser = await User.findOne({ email })

            if (existingUser) {
                return res.status(HTTP_STATUS.ALREADY_EXISTS).send({
                    success: false,
                    message: "Email is already registered!, Please Login",
                })
            }

            const user = await User.create({ username, email, password: hashedPassword, answer, role, address })

            return res.status(HTTP_STATUS.SUCCESS).send({
                success: true,
                message: "Sign Up Successfully",
                user
            })

        } catch (error) {
            return res.status(HTTP_STATUS.SERVER_ERROR).send({
                success: false,
                message: "Sign Up Failed!",
                error: error.message,
            })

        }

    },

    login: async (req, res) => {

        try {
            const { email, password } = req.body;

            const existingUser = await User.findOne({ email })

            if (!existingUser) {
                return res.status(HTTP_STATUS.NOT_FOUND).send({
                    success: false,
                    message: "Email is Not Registered, Please Sign Up!",
                })

            }

            const match = await bcrypt.compare(password, existingUser.password)

            if (!match) {
                return res.status(HTTP_STATUS.NOT_FOUND).send({
                    success: false,
                    message: "Invalid Password",
                })
            }

            const token = jwt.sign({ id: existingUser.id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' })

            return res.status(HTTP_STATUS.SUCCESS).send({
                success: true,
                message: "Login Successfully",
                user: {
                    id: existingUser.id,
                    username: existingUser.username,
                    email: existingUser.email,
                },
                token,
            })


        } catch (error) {
            return res.status(HTTP_STATUS.SERVER_ERROR).send({
                success: false,
                message: "Error in Login!",
                error: error.message,
            })

        }

    },

    forgot: async (req, res) => {

        try {

            const { email, answer, newPassword } = req.body;

            if (!email || !answer || !newPassword) {
                return res.send({
                    message: "All Fields are Requied!"
                })
            }

            const user = await User.findOne({ email, answer })

            if (!user) {
                return res.status(HTTP_STATUS.BAD_REQUEST).send({
                    success: false,
                    message: "Wrong email or answer",
                })
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            const newData = await User.update({ password: user.password }).set({ password: hashedPassword })

            return res.status(HTTP_STATUS.SUCCESS).send({
                success: true,
                message: "Password Reset Successfully",
            })


        } catch (error) {
            return res.status(HTTP_STATUS.SERVER_ERROR).send({
                success: false,
                message: "Something Went Wrong!",
                error
            })

        }

    },

    find: async (req, res) => {
        try {

            const users = await User.find({})

            res.status(HTTP_STATUS.SUCCESS).send({
                success: true,
                countTotal: users.length,
                message: "All Users",
                users,
            });
        } catch (error) {
            res.status(HTTP_STATUS.SERVER_ERROR).send({
                success: false,
                message: "Error in getting users",
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
                    success: false,
                    message: "User Not Found",
                });
            }

            res.status(HTTP_STATUS.SUCCESS).send({
                success: true,
                message: "Fetched User",
                user,
            });

        } catch (error) {
            res.status(HTTP_STATUS.SERVER_ERROR).send({
                success: false,
                message: "Error in getting user",
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
    
            if(users.length <= 0){
                res.status(HTTP_STATUS.SUCCESS).send({
                    success: true,
                    message: "No Users Found At This Page",
                });
            }

            return res.status(HTTP_STATUS.SUCCESS).send({
                success: true,
                message: `${users.length} Users Fetched At Page ${page}`,
                users
            });

        } catch (error) {
            return res.serverError(error);
        }
    },


    delete: async (req, res) => {
        try {
            const id = req.params.id;

            const findUser = await User.findOne({ id });

            if (!findUser) {
                return res.status(HTTP_STATUS.NOT_FOUND).send({
                    success: false,
                    message: "User Not Found",
                });
            }

            const deletedUser = await User.destroy({ id }).fetch();

            res.status(HTTP_STATUS.SUCCESS).send({
                success: true,
                message: "User Deleted Successfully",
                deletedUser
            });

        } catch (error) {
            res.status(HTTP_STATUS.SERVER_ERROR).send({
                success: false,
                message: "error while deleting user",
                error: error.message,
            });
        }
    },

};

