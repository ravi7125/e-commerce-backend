/**
 * CategoryController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


const { slugify, HTTP_STATUS } = require('../../config/constants')

module.exports = {

    create: async (req, res) => {
        try {
            const name = req.body.name;

            if (!name) {
                return res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Category name is required" });
            }
            const existingCategory = await Category.findOne({ name: name });

            if (existingCategory) {
                return res.status(HTTP_STATUS.SUCCESS).send({
                    success: false,
                    message: "Category Already Exists",
                    existingCategory
                });
            }

            const category = await Category.create({ name, slug: slugify(name) })

            res.status(HTTP_STATUS.SUCCESS).send({
                success: true,
                message: "New category created",
                category,
            });
        } catch (error) {
            res.status(HTTP_STATUS.SERVER_ERROR).send({
                success: false,
                error: error.message,
                message: "Error in Category",
            });
        }
    },
    update: async (req, res) => {
        try {
            const { name } = req.body;
            const id = req.params.id;
            const category = await Category.findOne({ id });

            if (!category) {
                return res.status(HTTP_STATUS.NOT_FOUND).send({
                    success: false,
                    message: "Category Not Found",
                });
            }

            const updatedCategory = await Category.update({ name: category.name, slug: slugify(category.name) }).set({ name: name, slug: slugify(name) }).fetch()

            res.status(HTTP_STATUS.SUCCESS).send({
                success: true,
                messsage: "Category Updated Successfully",
                updatedCategory,
            });
        } catch (error) {
            console.log(error);
            res.status(HTTP_STATUS.SERVER_ERROR).send({
                success: false,
                message: "Error while updating category",
                error: error.message,
            });
        }
    },

    find: async (req, res) => {
        try {
            const category = await Category.find({});
            res.status(HTTP_STATUS.SUCCESS).send({
                success: true,
                message: "All Categories List",
                category,
            });
        } catch (error) {
            console.log(error);
            res.status(HTTP_STATUS.SERVER_ERROR).send({
                success: false,
                message: "Error while getting all categories",
                error: error.message,
            });
        }
    },

    findOne: async (req, res) => {
        try {
            const id = req.params.id;
            const category = await Category.findOne({ id });

            if (!category) {
                return res.status(HTTP_STATUS.NOT_FOUND).send({
                    success: false,
                    message: "Category Not Found",
                });
            }

            res.status(HTTP_STATUS.SUCCESS).send({
                success: true,
                message: "Category Fetched Successfully",
                category,
            });

        } catch (error) {
            console.log(error);
            res.status(HTTP_STATUS.SERVER_ERROR).send({
                success: false,
                message: "Error while getting Single Category",
                error: error.message,
            });
        }
    },

    delete: async (req, res) => {
        try {
            const id = req.params.id;

            const findCategory = await Category.findOne({ id });

            if (!findCategory) {
                return res.status(HTTP_STATUS.NOT_FOUND).send({
                    success: false,
                    message: "Category Not Found",
                });
            }

            const deletedCategory = await Category.destroy({ id }).fetch();

            res.status(HTTP_STATUS.SUCCESS).send({
                success: true,
                message: "Categry Deleted Successfully",
                deletedCategory
            });

        } catch (error) {
            console.log(error);
            res.status(HTTP_STATUS.SERVER_ERROR).send({
                success: false,
                message: "error while deleting category",
                error: error.message,
            });
        }
    },

};

