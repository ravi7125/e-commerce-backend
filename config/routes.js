/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

     // Auth Routes
     'POST /api/v1/auth/signup': 'UserController.signup',
     'POST /api/v1/auth/login': 'UserController.login',
     'POST /api/v1/auth/forgot-password': 'UserController.forgot',
     'GET /api/v1/auth/get-users': 'UserController.find',
     'GET /api/v1/auth/get-users/:id': 'UserController.findOne',
     'GET /api/v1/auth/list-users': 'UserController.listUsers',
     'DELETE /api/v1/auth/delete-user/:id': 'UserController.delete',
     
     // Category Routes
     'POST /api/v1/category/create-category': 'CategoryController.create',
     'PATCH /api/v1/category/update-category/:id': 'CategoryController.update',
     'GET /api/v1/category/get-category': 'CategoryController.find',
     'GET /api/v1/category/single-category/:id': 'CategoryController.findOne',
     'DELETE /api/v1/category/delete-category/:id': 'CategoryController.delete',
     
     // Product Routes
     'POST /api/v1/product/create-product': 'ProductController.create',
     'GET /api/v1/product/get-product': 'ProductController.find',
     'GET /api/v1/product/list-product': 'ProductController.listProducts',
     'GET /api/v1/product/get-product/:slug': 'ProductController.findOne',
     'GET /api/v1/product/product-photo/:pid': 'ProductController.getPhoto',
     'DELETE /api/v1/product/delete-product/:pid': 'ProductController.delete',
     'GET /api/v1/product/product-count': 'ProductController.productCount',
     'GET /api/v1/product/search/:keyword': 'ProductController.search',

     // Cart Routes 
     'POST /api/v1/cart/create': 'CartController.create',
     'GET /api/v1/cart/:userId': 'CartController.getCart',
     'POST /api/v1/cart/add-to-cart': 'CartController.addToCart',
     'POST /api/v1/cart/remove-from-cart': 'CartController.removeFromCart',

};
