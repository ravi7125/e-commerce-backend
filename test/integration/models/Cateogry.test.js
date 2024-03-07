const { expect } = require('chai');

describe('User Model', () => {

  describe('Attributes', () => {
    it('should have the correct attributes', () => {
      expect(Category.attributes).to.haveOwnProperty('name');
      expect(Category.attributes).to.haveOwnProperty('slug');
    });

    it('should have correct attribute types', () => {
      expect(Category.attributes.name.type).to.equal('string');
      expect(Category.attributes.name.type).to.equal('string');
    });

    it('should have correct attribute validations', () => {
      expect(Category.attributes.name.required).to.be.true;
      expect(Category.attributes.slug.required).to.be.true;
    });
  });

});
