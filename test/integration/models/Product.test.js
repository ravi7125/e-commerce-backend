const { expect } = require('chai');

describe('Product Model', () => {

  describe('Attributes', () => {
    it('should have the correct attributes', () => {
      expect(Product.attributes).to.haveOwnProperty('name');
      expect(Product.attributes).to.haveOwnProperty('slug');
      expect(Product.attributes).to.haveOwnProperty('description');
      expect(Product.attributes).to.haveOwnProperty('price');
      expect(Product.attributes).to.haveOwnProperty('category');
      expect(Product.attributes).to.haveOwnProperty('quantity');
      expect(Product.attributes).to.haveOwnProperty('photo');
      expect(Product.attributes).to.haveOwnProperty('carts');
    });

    it('should have correct attribute types', () => {
      expect(Product.attributes.name.type).to.equal('string');
      expect(Product.attributes.slug.type).to.equal('string');
      expect(Product.attributes.description.type).to.equal('string');
      expect(Product.attributes.price.type).to.equal('number');
      expect(Product.attributes.category.model).to.equal('category');
      expect(Product.attributes.quantity.type).to.equal('number');
      expect(Product.attributes.photo.type).to.equal('string');
      expect(Product.attributes.carts.collection).to.equal('cart');
      expect(Product.attributes.carts.via).to.equal('products');
    });

    it('should have correct attribute validations', () => {
      expect(Product.attributes.name.required).to.be.true;
      expect(Product.attributes.slug.required).to.be.true;
      expect(Product.attributes.description.required).to.be.true;
      expect(Product.attributes.price.required).to.be.true;
      expect(Product.attributes.category.required).to.be.true;
      expect(Product.attributes.quantity.required).to.be.true;
      expect(Product.attributes.photo.required).to.be.true;
    });
  });

});
