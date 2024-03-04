// api/controllers/CartController.js

const { HTTP_STATUS } = require('../../config/constants');

module.exports = {

    create: async function (req, res) {
        try {
            const { userid } = req.body;

            const existingCart = await Cart.findOne({ userid }).populate('userid');

            if (existingCart) {
                return res.status(HTTP_STATUS.ALREADY_EXISTS).send({
                    success: req.i18n.__('SUCCESS_FALSE'),
                    message: req.i18n.__('ALREADY_EXISTS_CART'),
                    existingCart,
                });
            }

            const newCart = await Cart.create({ userid, products: [] }).fetch();

            return res.status(HTTP_STATUS.SUCCESS).send({
                success: req.i18n.__('SUCCESS_TRUE'),
                message: req.i18n.__('CART_CREATED'),
                newCart
            });
        } catch (error) {
            return res.status(HTTP_STATUS.SERVER_ERROR).send({
                success: req.i18n.__('SUCCESS_FALSE'),
                message: req.i18n.__('SERVER_ERROR_CART'),
                error: error.message
            });
        }
    },

    addToCart: async function (req, res) {
        try {
            const { cartId, productId } = req.body;

            const cart = await Cart.findOne({ id: cartId }).populate('products');

            if (!cart) {
                return res.status(HTTP_STATUS.NOT_FOUND).send({
                    success: req.i18n.__('SUCCESS_FALSE'),
                    message: req.i18n.__('CART_NOT_FOUND'),
                });
            }

            const product = await Product.findOne({ id: productId });

            if (!product) {
                return res.status(HTTP_STATUS.NOT_FOUND).send({
                    success: req.i18n.__('SUCCESS_FALSE'),
                    message: req.i18n.__('PRODUCT_NOT_FOUND'),
                });
            }

            // Ensure the products attribute is initialized as an array
            cart.products = cart.products.map(product => product.id) || [];

            await Cart.addToCollection(cartId, 'products', [...cart?.products, productId])


            // Add product ID to the cart
            // cart.products.push(productId);

            // Update the cart with the new product ID
            // await Cart.updateOne({ id: cartId }).set({ products: cart.products });

            // Fetch updated cart data with populated products
            const updatedCartData = await Cart.findOne({ id: cartId }).populate('products');

            return res.status(HTTP_STATUS.SUCCESS).send({
                success: req.i18n.__('SUCCESS_TRUE'),
                message: req.i18n.__('ADD_TO_CART'),
                cartData: updatedCartData
            });

        } catch (error) {
            return res.status(HTTP_STATUS.SERVER_ERROR).send({
                success: req.i18n.__('SUCCESS_FALSE'),
                message: req.i18n.__('SERVER_ERROR_CART'),
                error: error.message
            });
        }
    },


    getCart: async function (req, res) {
        try {
            const { userId } = req.params;
            const cart = await Cart.findOne({ userid: userId }).populate('products');

            if (cart) {
                return res.status(HTTP_STATUS.SUCCESS).send({
                    success: req.i18n.__('SUCCESS_TRUE'),
                    message: req.i18n.__('FETCHED_CART_ITEMS'),
                    cart
                });
            }

            res.status(HTTP_STATUS.NOT_FOUND).send({
                success: req.i18n.__('SUCCESS_FALSE'),
                message: req.i18n.__('USER_NOT_FOUND'),
            });
        } catch (error) {
            return res.status(HTTP_STATUS.SERVER_ERROR).send({
                success: req.i18n.__('SUCCESS_FALSE'),
                message: req.i18n.__('SERVER_ERROR_CART'),
                error: error.message
            });
        }
    },

    removeFromCart: async (req, res) => {
        try {
            const { cartId, productId } = req.body;

            const cart = await Cart.findOne({ id: cartId }).populate('products');

            if (!cart) {
                return res.status(HTTP_STATUS.NOT_FOUND).send({
                    success: req.i18n.__('SUCCESS_FALSE'),
                    message: req.i18n.__('CART_NOT_FOUND'),
                });
            }

            cart.products = cart.products.map(product => product.id) || [];

            await Cart.removeFromCollection(cartId, 'products', productId)


            // cart.products.push(productId);

            // // Filter out the product with the specified productId from the products array
            // const updatedProducts = cart.products?.filter(product => product !== productId);

            // await Cart.updateOne({ id: cartId }).set({ products: updatedProducts });

            const updatedCart = await Cart.findOne({ id: cartId }).populate('products');

            return res.status(HTTP_STATUS.SUCCESS).send({
                success: req.i18n.__('SUCCESS_TRUE'),
                message: req.i18n.__('REMOVE_FROM_CART'),
                updatedCart
            });

        } catch (error) {
            return res.status(HTTP_STATUS.SERVER_ERROR).send({
                success: req.i18n.__('SUCCESS_FALSE'),
                message: req.i18n.__('SERVER_ERROR_CART'),
                error: error.message
            });
        }
    },

};
