/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    username: {
      type: 'string',
      required: true
    },
    email: {
      type: 'string',
      required: true,
      unique: true
    },
    password: {
      type: 'string',
      required: true
    },
    answer: {
      type: 'string',
      required: true
    },
    address: {
      type: 'string',
      required: true
    },
    role: {
      type: 'number',
      defaultsTo: 0
    },
    
  },

};

