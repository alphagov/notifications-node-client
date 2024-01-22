var expect = require('chai').expect,
    MockDate = require('mockdate'),
    jose = require('jose'),
    createGovukNotifyToken = require('../client/authentication.js');


describe('Authentication', function() {

  beforeEach(function() {
    MockDate.set(1234567890000);
  });

  afterEach(function() {
    MockDate.reset();
  });

  describe('tokens', function() {

    it('can be generated and decoded', function(done) {

      createGovukNotifyToken("POST", "/v2/notifications/sms", "SECRET", 123)
        .then((token) => {

          expect(token).to.equal('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOjEyMywiaWF0IjoxMjM0NTY3ODkwfQ.18aBKSLffjbX_TLmosB_qYgW9EkWIQpBgWy7GpiKg6o');
          var decoded = jose.decodeJwt(token, 'SECRET');
          expect(decoded.iss).to.equal(123);
          expect(decoded.iat).to.equal(1234567890);
          done();
        });

    });

  });

});
