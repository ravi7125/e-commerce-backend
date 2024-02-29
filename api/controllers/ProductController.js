/**
 * ProductController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const multer = require('multer')
const slugify = require('slugify')

module.exports = {

    create: async (req, res) => {
        try {
            const { name, description, price, quantity, category } = req.body;

            if (!name || !description || !price || !quantity || !category) {
                return res.status(400).send({ error: "All fields are required." });
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
                return res.status(400).send({ error: "No file uploaded." });
            }

            const photoFilename = uploadedFiles[0].fd;

            const filePath = `/Users/ztlab111/Desktop/code/Sailsjs/Click-N-Buy/frontend/public/uploads/${photoFilename}`;

            const fileName = filePath.match(/\/([^\/]+)$/)[1];

            // console.log("File name" + fileName);

            const existingProduct = await Product.findOne({ name });

            if (existingProduct) {
                return res.status(400).send({
                    success: false,
                    message: "Product name already exists.",
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

            res.status(201).send({
                success: true,
                message: "New product created successfully.",
                product,
            });
        } catch (error) {
            res.status(500).send({
                success: false,
                message: "Error in creating product.",
                error: error.message,
            });
        }
    },

    find: async (req, res) => {
        try {
            const products = await Product
                .find({})

            res.status(200).send({
                success: true,
                countTotal: products.length,
                message: "All Products",
                products: products,
            });
        } catch (error) {
            res.status(500).send({
                success: false,
                message: "Error in getting products",
                error: error.message,
            });
        }
    },

    findOne: async (req, res) => {
        try {
            const product = await Product
                .findOne({ slug: req.params.slug });

            if (!product) {
                return res.status(404).send({
                    success: false,
                    message: "Product Not Found",
                })
            }

            res.status(200).send({
                success: true,
                message: "Single Product Fetched",
                product,
            });

        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: "Eror while getitng single product",
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

            const users = await Product.find({})
            .skip(skip)
            .limit(limit);
    
            if(users.length <= 0){
                res.status(200).send({
                    success: true,
                    message: "No Products Found At This Page",
                });
            }

            return res.status(200).send({
                success: true,
                message: `${users.length} Products Fetched At Page ${page}`,
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
                res.status(200).send(product.photo.photo)
            }

        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: "Error while getting photo",
                error,
            });
        }
    },

    delete: async (req, res) => {
        try {
            await Product.destroy({ id: req.params.pid });
            res.status(200).send({
                success: true,
                message: "Product Deleted successfully",
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: "Error while deleting product",
                error,
            });
        }
    },

    productCount: async (req, res) => {
        try {
            const total = await Product.find({});

            res.status(200).send({
                success: true,
                total: total.length,
                allProducts: total,
            });
        } catch (error) {
            console.log(error);
            res.status(400).send({
                message: "Error in product count",
                error: error.message,
                success: false,
            });
        }
    },

    search: async (req, res) => {
        try {
            const { keyword } = req.params;
            const results = await Product
                .find({
                    or: [
                        { name: { contains: keyword } },
                        { description: { contains: keyword } },
                    ],
                })

            res.json(results);

        } catch (error) {
            console.log(error);
            res.status(400).send({
                success: false,
                message: "Error In Search Product API",
                error: error.message,
            });
        }
    },


};

