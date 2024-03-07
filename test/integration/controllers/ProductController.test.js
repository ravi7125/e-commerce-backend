const supertest = require('supertest');
const TestingCallbacks = require('../helpers/TestingCallbacks.js');
const { getText } = require('./UserController.test.js');
const fs = require('fs');

let productData;

describe('Testing Product Controller', () => {
  it('Creting Product', (done) => {

    const text = getText();

    supertest(sails.hooks.http.app)
      .post('/api/product/create-product')
      .set({ 'Authorization': text.token })
      .field('name', 'best Watch')
      .field('description', 'It\'s Best Watch Launched by Realme and it is the best seller watch')
      .field('price', 300)
      .field('quantity', 30)
      .field('category', '65e56fb1c0aa93309aaf5d8e')
      .attach('photo',
        fs.readFileSync('/Users/ztlab111/Desktop/code/Click-N-Buy/frontend/public/images/a2.jpg'),
        'a2.jpg')
      .end((err, res) => {
        TestingCallbacks.fn(err, res, done);
        productData = TestingCallbacks.parseText(res.text);
      });
  });

  it('Finding Products', (done) => {

    const text = getText();

    supertest(sails.hooks.http.app)
      .get('/api/product/get-product')
      .set({ 'Authorization': text.token })
      .end((err, res) => {
        TestingCallbacks.fn(err, res, done);
      });
  });

  it('Finding Single Product', (done) => {

    const text = getText();

    supertest(sails.hooks.http.app)
      // .get(`/api/product/get-product/${productData.createdProduct.slug}`)
      .get(`/api/product/get-product/galaxy-watch`)
      .set({ 'Authorization': text.token })
      .end((err, res) => {
        TestingCallbacks.fn(err, res, done);
      });
  });

  it('Product Counts', (done) => {

    const text = getText();

    supertest(sails.hooks.http.app)
      .get('/api/product/product-count')
      .set({ 'Authorization': text.token })
      .end((err, res) => {
        TestingCallbacks.fn(err, res, done);
      });
  });

  it('Listing Products', (done) => {

    const text = getText();

    supertest(sails.hooks.http.app)
      .get('/api/product/list-product?perPage=2')
      .set({ 'Authorization': text.token })
      .end((err, res) => TestingCallbacks.fn(err, res, done));
  });

  it('Searching Product', (done) => {

    const text = getText();
    const keyword = 'google';

    supertest(sails.hooks.http.app)
      .get(`/api/product/search/${keyword}`)
      .set({ 'Authorization': text.token })
      .end((err, res) => {
        TestingCallbacks.fn(err, res, done);
      });
  });

  it('Deleting Product', (done) => {

    const text = getText();

    supertest(sails.hooks.http.app)
        .delete(`/api/product/delete-product/${productData.createdProduct.id}`)
        .set({ 'Authorization': text.token })
        .end((err, res) => {
          TestingCallbacks.fn(err, res, done);
        });
  });

});
module.exports = {
  getProductData: () => productData
};
