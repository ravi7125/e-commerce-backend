/**
 * CartController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const { HTTP_STATUS } = require('../../config/constants')

module.exports = {

    create: async (req, res) => {
        try {
            const { userid } = req.body;

            const existingCart = await Cart.findOne({ userid })

            if (existingCart) {
                return res.status(HTTP_STATUS.ALREADY_EXISTS).send({
                    success: false,
                    message: "Cart is already Careated!",
                    existingCart,
                })
            }

            const newCart = await Cart.create({ userid, products: [] }).fetch();

            return res.status(HTTP_STATUS.ALREADY_EXISTS).send({
                success: true,
                message: "Cart Created Successfully",
                newCart
            });
        } catch (error) {
            return res.status(HTTP_STATUS.SERVER_ERROR).send({
                success: false,
                message: 'Server Error while Creating Cart',
                error: error.message
            });
        }
    },

    addToCart: async (req, res) => {
        try {
            const { cartId, productId } = req.body;

            const cart = await Cart.findOne({ id: cartId });

            if (!cart) {
                return res.status(HTTP_STATUS.NOT_FOUND).send({
                    success: false,
                    message: "Cart not found",
                });
            }

            // const isProductAlreadyAdded = await cart.products.includes(productId);

            const isProductAlreadyAdded = cart.products.filter(product => product.id === productId);

            if (isProductAlreadyAdded.length > 0) {
                return res.status(HTTP_STATUS.ALREADY_EXISTS).send({
                    success: false,
                    message: "Product is already added to the cart",
                    cartItems: cart?.products
                });
            }

            const product = await Product.findOne({ id: productId });

            if (!product) {
                return res.status(HTTP_STATUS.NOT_FOUND).send({
                    success: false,
                    message: "Product not found",
                });
            }

            // Add product details to the cart
            cart.products.push(product);

            const updatedCart = await Cart.updateOne({ id: cartId })
                .set({ products: cart.products });

            return res.status(HTTP_STATUS.SUCCESS).send({
                success: true,
                message: "Product is Added To Cart Successfully",
                updatedCart
            });

        } catch (error) {
            return res.status(HTTP_STATUS.SERVER_ERROR).send({
                success: false,
                message: 'Server Error while Adding Product To Cart',
                error: error.message
            });
        }
    },

    removeFromCart: async (req, res) => {
        try {
            // const { cartId, productId } = req.body;

            const { cartId, productId } = req.query;

            const cart = await Cart.findOne({ id: cartId });

            if (!cart) {
                return res.status(404).send({
                    success: false,
                    message: "Cart not found",
                });
            }

            // Remove the product with the specified productId from the products array
            const updatedProducts = cart.products.filter(product => product.id !== productId);

            // Update the cart with the updated products array
            const updatedCart = await Cart.updateOne({ id: cartId }).set({ products: updatedProducts });

            return res.status(HTTP_STATUS.SUCCESS).send({
                success: true,
                message: "Product Removed From Cart",
                updatedCart
            });
        } catch (error) {
            return res.status(HTTP_STATUS.SERVER_ERROR).send({
                success: false,
                message: 'Server error while Removing Product from Cart',
                error: error.message
            });
        }
    },

    getCart: async (req, res) => {
        try {
            const { userId } = req.params;
            const cart = await Cart.findOne({ userid: userId });

            if (cart) {
                return res.status(HTTP_STATUS.SUCCESS).send({
                    success: true,
                    message: "All Cart Items",
                    cart
                });
            }

            res.status(HTTP_STATUS.NOT_FOUND).send({
                success: false,
                message: "User not found",
            });
        } catch (error) {
            return res.status(HTTP_STATUS.SERVER_ERROR).send({
                success: false,
                message: 'Server Error while Getting Products',
                error: error.message
            });
        }
    }
};
