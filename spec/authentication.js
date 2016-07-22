var expect = require('chai').expect,
    MockDate = require('mockdate'),
    jwt = require('jsonwebtoken'),
    createGovukNotifyToken = require('../client/authentication.js');


describe('Authentication', function() {

  beforeEach(function() {
    MockDate.set(1234567890000);
  });

  afterEach(function() {
    MockDate.reset();
  });

  describe('tokens', function() {

    it('can be generated and decoded', function() {

      var token = createGovukNotifyToken("POST", "/notifications/sms", "SECRET", 123),
          decoded = jwt.verify(token, 'SECRET');

      expect(token).to.equal('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOjEyMywiaWF0IjoxMjM0NTY3ODkwfQ.R9-H_oV7d56Dal9jUAKThrZlo1_LNVqc3LCtY62WQd4');
      expect(decoded.iss).to.equal(123);
      expect(decoded.iat).to.equal(1234567890);

    });

  });

});
