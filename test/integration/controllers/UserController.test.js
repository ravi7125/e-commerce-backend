const supertest = require('supertest');
const TestingCallbacks = require('../helpers/TestingCallbacks');
var text;

describe('Testing User Controller', () => {
  it('User Sign Up', (done) => {
    supertest(sails.hooks.http.app)
      .post('/api/auth/signup')
      .send({
        username: 'tester',
        email: 'tester@gmail.com',
        password: 'tester123',
        answer: 'cricket',
        address: 'Ahmedabad'
      })
      .end((err, res) => TestingCallbacks.fn(err, res, done));

  });

  it('User Login', (done) => {
    supertest(sails.hooks.http.app)
      .post('/api/auth/login')
      .send({
        email: 'tester@gmail.com',
        password: 'tester123'
      })
      .end(async (err, res) => {
        text = await TestingCallbacks.parseText(res.text);
        TestingCallbacks.fn(err, res, done);
      });
  });

  it('Forgot Password', (done) => {
    supertest(sails.hooks.http.app)
      .post('/api/auth/forgot-password')
      .send({
        email: 'tester@gmail.com',
        answer: 'cricket',
        newPassword: 'tester123'
      })
      .end((err, res) => TestingCallbacks.fn(err, res, done));
  });

  it('Finding Users', (done) => {
    supertest(sails.hooks.http.app)
      .get('/api/auth/get-users')
      .end((err, res) => TestingCallbacks.fn(err, res, done));
  });

  it('Listing Users', (done) => {
    supertest(sails.hooks.http.app)
      .get('/api/auth/list-users?perPage=2')
      .set({ 'Authorization': text.token })
      .end((err, res) => TestingCallbacks.fn(err, res, done));
  });

  it('Delete User', (done) => {
    supertest(sails.hooks.http.app)
      .delete(`/api/auth/delete-user/65e8544e64b8d4559733b29e`)
      .set({ 'Authorization': text.token })
      .end((err, res) => {
        TestingCallbacks.fn(err, res, done);
      });
  });
});

module.exports = {
  getText: () => text
};
