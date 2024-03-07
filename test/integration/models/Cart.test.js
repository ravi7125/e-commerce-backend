const { expect } = require('chai');

describe('Cart Model', () => {
  describe('Attributes', () => {

    it('should have the correct attributes', () => {
      expect(Cart.attributes).to.haveOwnProperty('userid');
      expect(Cart.attributes).to.haveOwnProperty('products');
    });

    it('should have correct attribute types', () => {
      expect(Cart.attributes.userid.model).to.equal('user');
      expect(Cart.attributes.userid.required).to.be.true;
      expect(Cart.attributes.products.collection).to.equal('product');
      expect(Cart.attributes.products.via).to.equal('carts');
      expect(Cart.attributes.products.dominant).to.be.true;
    });

    it('should have correct attribute validations', () => {
      expect(Cart.attributes.userid.required).to.be.true;
    });

  });
});
