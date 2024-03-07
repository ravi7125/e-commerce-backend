const { expect } = require('chai');

describe('User Model', () => {

  describe('Attributes', () => {
    it('should have the correct attributes', () => {
      expect(User.attributes).to.haveOwnProperty('username');
      expect(User.attributes).to.haveOwnProperty('email');
      expect(User.attributes).to.haveOwnProperty('password');
      expect(User.attributes).to.haveOwnProperty('answer');
      expect(User.attributes).to.haveOwnProperty('address');
      expect(User.attributes).to.haveOwnProperty('role');
    });

    it('should have correct attribute types', () => {
      expect(User.attributes.username.type).to.equal('string');
      expect(User.attributes.email.type).to.equal('string');
      expect(User.attributes.password.type).to.equal('string');
      expect(User.attributes.answer.type).to.equal('string');
      expect(User.attributes.address.type).to.equal('string');
      expect(User.attributes.role.type).to.equal('number');
    });

    it('should have correct attribute validations', () => {
    //   console.log(User.attributes);
      expect(User.attributes.username.required).to.be.true;
      expect(User.attributes.password.required).to.be.true;
      expect(User.attributes.answer.required).to.be.true;
      expect(User.attributes.address.required).to.be.true;
      expect(User.attributes.email.required).to.be.true;
      expect(User.attributes.email.autoMigrations.unique).to.be.true;
      expect(User.attributes.role.defaultsTo).to.equal(0);
    });
  });

});
