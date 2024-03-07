const supertest = require('supertest');
const TestingCallbacks = require('../helpers/TestingCallbacks.js');
const { getText } = require('./UserController.test.js');

let categoryData;

describe('Testing Category Controller', () => {
  it('Creating Category', (done) => {
    const text = getText();

    supertest(sails.hooks.http.app)
      .post('/api/category/create-category')
      .set({ 'Authorization': text.token })
      .send({
        name: 'Test Collection'
      })
      .end((err, res) => {
        categoryData = TestingCallbacks.parseText(res.text);
        TestingCallbacks.fn(err, res, done);
      });
  });

  it('Updating Category', (done) => {

    const text = getText();

    supertest(sails.hooks.http.app)
      .patch(`/api/category/update-category/${categoryData.category.id}`)
      .set('Authorization', text.token)
      .send({
        name: 'Mens Collection'
      })
      .end((err, res) => {
        TestingCallbacks.fn(err, res, done);
      });
  });

  it('Finding Categories', (done) => {

    const text = getText();

    supertest(sails.hooks.http.app)
      .get('/api/category/get-category')
      .set('Authorization', text.token)
      .end((err, res) => TestingCallbacks.fn(err, res, done));
  });

  it('Finding Category', (done) => {

    const text = getText();

    supertest(sails.hooks.http.app)
      .get(`/api/category/single-category/${categoryData.category.id}`)
      .set('Authorization', text.token)
      .end((err, res) => TestingCallbacks.fn(err, res, done));
  });
  it('Deleting Category', (done) => {

    const text = getText();

    supertest(sails.hooks.http.app)
      .delete(`/api/category/delete-category/65e9633f9755c31920707d7e`)
      .set('Authorization', text.token)
      .end((err, res) => TestingCallbacks.fn(err, res, done));
  });
});
