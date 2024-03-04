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
     'POST /api/auth/signup': 'UserController.signup',
     'POST /api/auth/login': 'UserController.login',
     'POST /api/auth/forgot-password': 'UserController.forgot',
     'GET /api/auth/get-users': 'UserController.find',
     'GET /api/auth/get-users/:id': 'UserController.findOne',
     'GET /api/auth/list-users': 'UserController.listUsers',
     'DELETE /api/auth/delete-user/:id': 'UserController.delete',
     
     // Category Routes
     'POST /api/category/create-category': 'CategoryController.create',
     'PATCH /api/category/update-category/:id': 'CategoryController.update',
     'GET /api/category/get-category': 'CategoryController.find',
     'GET /api/category/single-category/:id': 'CategoryController.findOne',
     'DELETE /api/category/delete-category/:id': 'CategoryController.delete',
     
     // Product Routes
     'POST /api/product/create-product': 'ProductController.create',
     'GET /api/product/get-product': 'ProductController.find',
     'GET /api/product/list-product': 'ProductController.listProducts',
     'GET /api/product/get-product/:slug': 'ProductController.findOne',
     'GET /api/product/product-photo/:pid': 'ProductController.getPhoto',
     'DELETE /api/product/delete-product/:pid': 'ProductController.delete',
     'GET /api/product/product-count': 'ProductController.productCount',
     'GET /api/product/search/:keyword': 'ProductController.search',

     // Cart Routes 
     'POST /api/cart/create': 'CartController.create',
     'GET /api/cart/:userId': 'CartController.getCart',
     'POST /api/cart/add-to-cart': 'CartController.addToCart',
     'POST /api/cart/remove-from-cart': 'CartController.removeFromCart',

}