/**
 * ProductController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const { slugify, HTTP_STATUS } = require('../../config/constants')


module.exports = {

    create: async (req, res) => {
        try {
            const { name, description, price, quantity, category } = req.body;

            if (!name || !description || !price || !quantity || !category) {
                return res.status(HTTP_STATUS.BAD_REQUEST).send({
                    success: req.i18n.__('SUCCESS_FALSE'),
                    message: req.i18n.__('REQUIRED'),
                });
            }

            const uploadedFiles = await new Promise((resolve, reject) => {
                req.file('photo').upload({
                    dirname: '/Users/ztlab111/Desktop/code/Sailsjs/Click-N-Buy/frontend/public/uploads',
                }, (error, files) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(files);
                    }
                });
            });

            if (!uploadedFiles || uploadedFiles.length === 0) {
                return res.status(HTTP_STATUS.BAD_REQUEST).send({ error: "No file uploaded." });
            }

            const photoFilename = uploadedFiles[0].fd;

            const filePath = `/Users/ztlab111/Desktop/code/Sailsjs/Click-N-Buy/frontend/public/uploads/${photoFilename}`;

            const fileName = filePath.match(/\/([^\/]+)$/)[1];

            // console.log("File name" + fileName);

            const existingProduct = await Product.findOne({ name }).populate('category');

            if (existingProduct) {
                return res.status(HTTP_STATUS.ALREADY_EXISTS).send({
                    success: req.i18n.__('SUCCESS_FALSE'),
                    message: req.i18n.__('ALREADY_EXISTS_PRODUCT_NAME'),
                    existingProduct
                });
            }

            const product = await Product.create({
                name,
                slug: slugify(name),
                description,
                price,
                quantity,
                category: slugify(category),
                photo: fileName,
            }).fetch();

            const createdProduct = await Product.findOne({ id: product.id }).populate('category');

            res.status(HTTP_STATUS.SUCCESS).send({
                success: req.i18n.__('SUCCESS_TRUE'),
                message: req.i18n.__('PRODUCT_CREATED'),
                createdProduct,
            });
        } catch (error) {
            res.status(HTTP_STATUS.SERVER_ERROR).send({
                success: req.i18n.__('SUCCESS_FALSE'),
                message: req.i18n.__('SERVER_ERROR_PRODUCT'),
                error: error.message,
            });
        }
    },

    find: async (req, res) => {
        try {
            const products = await Product
                .find({}).populate('category')

            res.status(HTTP_STATUS.SUCCESS).send({
                success: req.i18n.__('SUCCESS_TRUE'),
                countTotal: products.length,
                message: req.i18n.__('FETCHED_PRODUCTS'),
                products: products,
            });
        } catch (error) {
            res.status(HTTP_STATUS.SERVER_ERROR).send({
                success: req.i18n.__('SUCCESS_FALSE'),
                message: req.i18n.__('SERVER_ERROR_PRODUCT'),
                error: error.message,
            });
        }
    },

    findOne: async (req, res) => {
        try {
            const product = await Product
                .findOne({ slug: req.params.slug }).populate('category');

            if (!product) {
                return res.status(HTTP_STATUS.NOT_FOUND).send({
                    success: req.i18n.__('SUCCESS_FALSE'),
                    message: req.i18n.__('PRODUCT_NOT_FOUND'),
                })
            }

            res.status(HTTP_STATUS.SUCCESS).send({
                success: req.i18n.__('SUCCESS_TRUE'),
                message: req.i18n.__('SINGLE_PRODUCT'),
                product,
            });

        } catch (error) {
            console.log(error);
            res.status(HTTP_STATUS.SERVER_ERROR).send({
                success: req.i18n.__('SUCCESS_FALSE'),
                message: req.i18n.__('SERVER_ERROR_PRODUCT'),
                error: error.message,
            });
        }
    },

    listProducts: async (req, res) => {

        const page = req.query.page || 1; // Current page number
        const perPage = req.query.perPage || 2; // Number of items per page

        const skip = (page - 1) * perPage; // Calculate the number of items to skip
        const limit = perPage; // Limit the number of items per page

        try {

            const products = await Product.find({})
                .populate('category')
                .skip(skip)
                .limit(limit);

            if (products.length <= 0) {
                res.status(HTTP_STATUS.SUCCESS).send({
                    success: req.i18n.__('SUCCESS_TRUE'),
                    message: req.i18n.__('PRODUCT_NOT_FOUND_PAGE'),
                });
            }

            return res.status(HTTP_STATUS.SUCCESS).send({
                success: req.i18n.__('SUCCESS_TRUE'),
                message: req.i18n.__('FETCHED_PRODUCTS'),
                users
            });

        } catch (error) {
            return res.serverError(error);
        }
    },

    getPhoto: async (req, res) => {

        try {
            const product = await Product.find({ id: req.params.pid }).select("photo")

            if (product.photo.photo) {
                res.status(HTTP_STATUS.SUCCESS).send(product.photo.photo)
            }

        } catch (error) {
            console.log(error);
            res.status(HTTP_STATUS.SERVER_ERROR).send({
                success: req.i18n.__('SUCCESS_FALSE'),
                message: req.i18n.__('SERVER_ERROR_PRODUCT'),
                error,
            });
        }
    },

    delete: async (req, res) => {
        try {
            await Product.destroyOne({ id: req.params.pid });
            res.status(HTTP_STATUS.SUCCESS).send({
                success: req.i18n.__('SUCCESS_TRUE'),
                message: req.i18n.__('PRODUCT_DELETED'),
            });
        } catch (error) {
            console.log(error);
            res.status(HTTP_STATUS.SERVER_ERROR).send({
                success: req.i18n.__('SUCCESS_FALSE'),
                message: req.i18n.__('SERVER_ERROR_PRODUCT'),
                error,
            });
        }
    },

    productCount: async (req, res) => {
        try {
            const total = await Product.find({}).populate('category');

            res.status(HTTP_STATUS.SUCCESS).send({
                success: req.i18n.__('SUCCESS_TRUE'),
                total: total.length,
                allProducts: total,
            });
        } catch (error) {
            console.log(error);
            res.status(HTTP_STATUS.SERVER_ERROR).send({
                message: req.i18n.__('SERVER_ERROR_PRODUCT'),
                error: error.message,
                success: req.i18n.__('SUCCESS_FALSE'),
            });
        }
    },

    search: async (req, res) => {
        try {
            const { keyword } = req.params;
            const results = await Product
                .find({
                    or: [
                        { name: { contains: keyword.toLowerCase() } },
                        { description: { contains: keyword.toLowerCase() } },
                    ],
                }).populate('category')

            res.json(results);

        } catch (error) {
            console.log(error);
            res.status(HTTP_STATUS.SERVER_ERROR).send({
                success: req.i18n.__('SUCCESS_FALSE'),
                message: req.i18n.__('SERVER_ERROR_PRODUCT'),
                error: error.message,
            });
        }
    },


};

