var expect = require('chai').expect,
  ApiClient = require('../client/api_client.js'),
  nock = require('nock'),
  createGovukNotifyToken = require('../client/authentication.js');


describe('api client', function () {

  it('should make a get request with correct jwt token', function (done) {

    var urlBase = 'http://base',
      path = '/email',
      body = {
        'body': 'body text'
      },
      clientId = 123,
      secret = 'SECRET',
      apiClient = new ApiClient(urlBase, clientId, secret);

    nock(urlBase, {
      reqheaders: {
        'Authorization': 'Bearer ' + createGovukNotifyToken('GET', path, secret, clientId)
      }
    })
      .get(path)
      .reply(200, body);

    apiClient = new ApiClient(urlBase, clientId, secret);
    apiClient.get(path)
      .then(function (response) {
        expect(response.body).to.deep.equal(body);
        done();
    });
  });

  it('should make a post request with correct jwt token', function (done) {

    var urlBase = 'http://base',
      path = '/email',
      data = {
        'data': 'qwjjs'
      },
      clientId = 123,
      secret = 'SECRET',
      apiClient = new ApiClient(urlBase, clientId, secret);


    nock(urlBase, {
      reqheaders: {
        'Authorization': 'Bearer ' + createGovukNotifyToken('POST', path, secret, clientId)
      }
    })
      .post(path, data)
      .reply(200, {"hooray": "bkbbk"});

    apiClient = new ApiClient(urlBase, clientId, secret);
    apiClient.post(path, data)
      .then(function (response) {
        expect(response.statusCode).to.equal(200);
        done();
    });
  });

});
