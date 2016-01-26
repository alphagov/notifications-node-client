var expect = require('chai').expect,
    MockDate = require('mockdate'),
    jwt = require('jsonwebtoken'),
    create_govuk_notify_token = require('../authentication.js');


describe('Authentication', function() {

  beforeEach(function() {
    MockDate.set(1234567890000);
  });

  afterEach(function() {
    MockDate.reset();
  });

  describe('tokens', function() {

    it('should be generated without a payload', function() {

      var token = create_govuk_notify_token("POST", "/notifications/sms", "SECRET", 123),
          decoded = jwt.verify(token, 'SECRET');

      expect(token).to.equal('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOjEyMywiaWF0IjoxMjM0NTY3ODkwLCJyZXEiOiJBOVlNVWcrSVk1eDZ0MFN1NUM0Z0t3V3J4YzZXYkZTYWV5RDZWRFUwcWc4PSJ9.v0nbBEimXMrpwH20kX4Xrv6M9I1wZiTQe_Dm8UjPpN0');
      expect(decoded.iss).to.equal(123);
      expect(decoded.iat).to.equal(1234567890);
      expect(decoded.req).to.equal('A9YMUg+IY5x6t0Su5C4gKwWrxc6WbFSaeyD6VDU0qg8=');
      expect(decoded.pay).to.be.undefined;

    });

    it('should be generated with a payload', function() {

      var token = create_govuk_notify_token("POST", "/notifications/sms", "SECRET", 456, "{'content': 'Hello world'}"),
          decoded = jwt.verify(token, 'SECRET');

      expect(token).to.equal('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOjQ1NiwiaWF0IjoxMjM0NTY3ODkwLCJyZXEiOiJBOVlNVWcrSVk1eDZ0MFN1NUM0Z0t3V3J4YzZXYkZTYWV5RDZWRFUwcWc4PSIsInBheSI6IkhNcVhIUUtOVHVadUZHWVNGQzJ5T3I2N05VdXIxRmxja01UUHpHWVZVOFU9In0.rMiwF5HzFWdofyhIOJo08oEFRik1a4bqJn9I4K7M5kg');
      expect(decoded.iss).to.equal(456);
      expect(decoded.iat).to.equal(1234567890);
      expect(decoded.req).to.equal('A9YMUg+IY5x6t0Su5C4gKwWrxc6WbFSaeyD6VDU0qg8=');
      expect(decoded.pay).to.equal('HMqXHQKNTuZuFGYSFC2yOr67NUur1FlckMTPzGYVU8U=');

    });

  });

});
