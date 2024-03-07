/**
 * Product.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    name: {
      type: 'string',
      required: true
    },
    slug: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'string',
      required: true
    },
    price: {
      type: 'number',
      required: true
    },
    category: {
      model: 'Category',
      required: true
    },
    quantity: {
      type: 'number',
      required: true
    },
    photo: {
      type: 'string',
      required: true
    },
    carts: {
      collection: 'Cart',
      via: 'products',
    }

  },

};

