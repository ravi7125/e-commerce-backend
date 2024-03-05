/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

  // '*': true,

  ProductController: {
    '*': 'isAuthenticated',
   'create': 'isAdmin',
   'delete': 'isAdmin',
  },
  UserController: {
    '*': 'isAuthenticated',
    'delete': 'isAdmin',
    'login': true,
    'signup': true,
    'forgot':true,
    'findOne': true,
    'find': true
  },
  CategoryController: {
    '*':'isAuthenticated',
    'create': 'isAdmin',
    'delete': 'isAdmin',
    'update': 'isAdmin',
  },
  
  CartController: {
    '*': 'isAuthenticated',
    'getCart': true,
  },

};
