const supertest = require('supertest');
const TestingCallbacks = require('../helpers/TestingCallbacks.js');
const { getText } = require('./UserController.test.js');
const { getProductData } = require('./ProductController.test.js');

let cartData;

describe('Testing Cart Controller', () => {
  it('Creting Cart', (done) => {

    const text = getText();

    supertest(sails.hooks.http.app)
      .post('/api/cart/create')
      .set({ 'Authorization': text.token })
      .send({ userid: text.user.id })
      .end((err, res) => {
        TestingCallbacks.fn(err, res, done);
      });
  });
  it('Getting Cart', (done) => {

    const text = getText();

    supertest(sails.hooks.http.app)
      .get(`/api/cart/${text.user.id}`)
      .set({ 'Authorization': text.token })
      .end((err, res) => {
        TestingCallbacks.fn(err, res, done);
        cartData = TestingCallbacks.parseText(res.text);
        console.log(cartData);
      });
  });

  it('Add Product To Cart', (done) => {

    const text = getText();
    // const productData = getProductData();

    supertest(sails.hooks.http.app)
      .post('/api/cart/add-to-cart')
      .set({ 'Authorization': text.token })
      .send({
        cartId: cartData.cart.id,
        // productId: productData.createdProduct.id
        productId: '65e97b609c3a2318685cc85c'
      })
      .end((err, res) => {
        TestingCallbacks.fn(err, res, done);
      });
  });

  it('Remove Product From Cart', (done) => {

    const text = getText();
    // const productData = getProductData();

    supertest(sails.hooks.http.app)
      .post('/api/cart/remove-from-cart')
      .set({ 'Authorization': text.token })
      .send({
        cartId: cartData.cart.id,
        // productId: productData.createdProduct.id
        productId: '65e97bd4bbed3c5c8daf7980'
      })
      .end((err, res) => TestingCallbacks.fn(err, res, done));
  });
});

