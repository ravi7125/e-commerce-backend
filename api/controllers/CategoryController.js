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
                    success: req.i18n.__('SUCCESS_FALSE'),
                    message: req.i18n.__('ALREADY_EXISTS_CATEGORY_NAME'),
                    existingCategory
                });
            }

            const category = await Category.create({ name, slug: slugify(name) })

            res.status(HTTP_STATUS.SUCCESS).send({
                success: req.i18n.__('SUCCESS_TRUE'),
                message: req.i18n.__('CATEGORY_CREATED'),
                category,
            });
        } catch (error) {
            res.status(HTTP_STATUS.SERVER_ERROR).send({
                success: req.i18n.__('SUCCESS_FALSE'),
                error: error.message,
                message: req.i18n.__('SERVER_ERROR_CATEGORY'),
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
                    success: req.i18n.__('SUCCESS_FALSE'),
                    message: req.i18n.__('CATEGORY_NOT_FOUND'),
                });
            }

            const updatedCategory = await Category.update({ name: category.name, slug: slugify(category.name) }).set({ name: name, slug: slugify(name) }).fetch()

            res.status(HTTP_STATUS.SUCCESS).send({
                success: req.i18n.__('SUCCESS_TRUE'),
                messsage: req.i18n.__('CATEGORY_UPDATED'),
                updatedCategory,
            });
        } catch (error) {
            console.log(error);
            res.status(HTTP_STATUS.SERVER_ERROR).send({
                success: req.i18n.__('SUCCESS_FALSE'),
                message: req.i18n.__('SERVER_ERROR_CATEGORY'),
                error: error.message,
            });
        }
    },

    find: async (req, res) => {
        try {
            const category = await Category.find({});
            res.status(HTTP_STATUS.SUCCESS).send({
                success: req.i18n.__('SUCCESS_TRUE'),
                message: req.i18n.__('FETCHED_CATEGORY'),
                category,
            });
        } catch (error) {
            console.log(error);
            res.status(HTTP_STATUS.SERVER_ERROR).send({
                success: req.i18n.__('SUCCESS_FALSE'),
                message: req.i18n.__('SERVER_ERROR_CATEGORY'),
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
                    success: req.i18n.__('SUCCESS_FALSE'),
                    message: req.i18n.__('CATEGORY_NOT_FOUND'),
                });
            }

            res.status(HTTP_STATUS.SUCCESS).send({
                success: req.i18n.__('SUCCESS_TRUE'),
                message: req.i18n.__('SINGLE_CATEGORY'),
                category,
            });

        } catch (error) {
            console.log(error);
            res.status(HTTP_STATUS.SERVER_ERROR).send({
                success: req.i18n.__('SUCCESS_FALSE'),
                message: req.i18n.__('SERVER_ERROR_CATEGORY'),
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
                    success: req.i18n.__('SUCCESS_FALSE'),
                    message: req.i18n.__('CATEGORY_NOT_FOUND'),
                });
            }

            const deletedCategory = await Category.destroyOne({ id }).fetch();

            res.status(HTTP_STATUS.SUCCESS).send({
                success: req.i18n.__('SUCCESS_TRUE'),
                message: req.i18n.__('CATEGORY_DELETED'),
                deletedCategory
            });

        } catch (error) {
            console.log(error);
            res.status(HTTP_STATUS.SERVER_ERROR).send({
                success: req.i18n.__('SUCCESS_FALSE'),
                message: req.i18n.__('SERVER_ERROR_CATEGORY'),
                error: error.message,
            });
        }
    },

};

