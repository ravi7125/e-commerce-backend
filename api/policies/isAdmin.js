const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        console.log(req)
        const user = await User.findOne({id: req?.user?.id});
        if (user.role !== 1) {
            return res.status(401).send({
                success: false,
                message: "UnAuthorized Access"
            })
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            message: 'Error in Admin Middleware',
            error: error.message
        })
    }
}