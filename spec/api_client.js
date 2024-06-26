var expect = require('chai').expect,
  MockDate = require('mockdate'),
  ApiClient = require('../client/api_client.js'),
  nock = require('nock'),
  createGovukNotifyToken = require('../client/authentication.js'),
  version = require('../package.json').version,
  axios = require('axios'),
  sinon = require('sinon');

describe('api client', function () {

  beforeEach(function() {
    MockDate.set(1234567890000);
  });

  afterEach(function() {
    MockDate.reset();
  });

  it('should make a get request with correct headers', function (done) {

    var urlBase = 'https://api.notifications.service.gov.uk',
      path = '/email',
      body = {
        'body': 'body text'
      },
      serviceId = 'c745a8d8-b48a-4b0d-96e5-dbea0165ebd1',
      apiKeyId = '8b3aa916-ec82-434e-b0c5-d5d9b371d6a3';

    [
      new ApiClient(serviceId, apiKeyId),
      new ApiClient(urlBase, serviceId, apiKeyId),
      new ApiClient(urlBase, 'key_name' + '-' + serviceId + '-' + apiKeyId),
      new ApiClient('key_name' + ':' + serviceId + ':' + apiKeyId),
    ].forEach(function(client, index, clients) {

      nock(urlBase, {
        reqheaders: {
          'Authorization': 'Bearer ' + createGovukNotifyToken('GET', path, apiKeyId, serviceId),
          'User-Agent': 'NOTIFY-API-NODE-CLIENT/' + version
        }
      })
        .get(path)
        .reply(200, body);

      client.get(path)
        .then(function (response) {
          expect(response.data).to.deep.equal(body);
          if (index == clients.length - 1) done();
      });

    });

  });

  it('should make a post request with correct headers', function (done) {

    var urlBase = 'http://localhost',
      path = '/email',
      data = {
        'data': 'qwjjs'
      },
      serviceId = 123,
      apiKeyId = 'SECRET',
      apiClient = new ApiClient(urlBase, serviceId, apiKeyId);

    nock(urlBase, {
      reqheaders: {
        'Authorization': 'Bearer ' + createGovukNotifyToken('POST', path, apiKeyId, serviceId),
        'User-Agent': 'NOTIFY-API-NODE-CLIENT/' + version
      }
    })
      .post(path, data)
      .reply(200, {"hooray": "bkbbk"});

    apiClient = new ApiClient(urlBase, serviceId, apiKeyId);
    apiClient.post(path, data)
      .then(function (response) {
        expect(response.status).to.equal(200);
        done();
    });
  });

  it('should direct get requests through the proxy when set', function (done) {
    var urlBase = 'https://api.notifications.service.gov.uk',
      proxyConfig = { host: 'addressofmyproxy.test', protocol: 'http'},
      path = '/email',
      apiClient = new ApiClient(urlBase, 'apiKey');

    nock("http://" + proxyConfig.host)
      .get(urlBase + path)
      .reply(200, 'test');

    apiClient.setProxy(proxyConfig);
    apiClient.get(path)
      .then(function (response) {
        expect(response.status).to.equal(200);
        expect(response.config.proxy).to.eql(proxyConfig);
        done();
    });
  });

  it('should direct post requests through the proxy when set', function (done) {
    var urlBase = 'https://api.notifications.service.gov.uk',
      proxyConfig = { host: 'addressofmyproxy.test', protocol: 'http'},
      path = '/email',
      apiClient = new ApiClient(urlBase, 'apiKey');

    nock("http://" + proxyConfig.host)
      .post(urlBase + path)
      .reply(200, 'test');

    apiClient.setProxy(proxyConfig);
    apiClient.post(path)
      .then(function (response) {
        expect(response.status).to.equal(200);
        expect(response.config.proxy).to.eql(proxyConfig);
        done();
    });
  });

  it('should use the custom Axios client when set', function (done) {
    var urlBase = 'https://api.notifications.service.gov.uk',
      path = '/email',
      body = {
        'body': 'body text'
      },
      serviceId = 'c745a8d8-b48a-4b0d-96e5-dbea0165ebd1',
      apiKeyId = '8b3aa916-ec82-434e-b0c5-d5d9b371d6a3';

    var customClientStub = sinon.stub().resolves({ data: body });

    var apiClient = new ApiClient(serviceId, apiKeyId);
    apiClient.setClient(customClientStub);

    nock(urlBase, {
      reqheaders: {
        'Authorization': 'Bearer ' + createGovukNotifyToken('GET', path, apiKeyId, serviceId),
        'User-Agent': 'NOTIFY-API-NODE-CLIENT/' + version
      }
    })
      .get(path)
      .reply(200, body);

    apiClient.get(path)
      .then(function (response) {
        expect(response.data).to.deep.equal(body);
        expect(customClientStub.calledOnce).to.be.true;
        expect(customClientStub.args[0][0].url).to.equal(urlBase + path);
        expect(customClientStub.args[0][0].headers['Authorization']).to.equal('Bearer ' + createGovukNotifyToken('GET', path, apiKeyId, serviceId));
        expect(customClientStub.args[0][0].headers['User-Agent']).to.equal('NOTIFY-API-NODE-CLIENT/' + version);
        done();
      })
      .catch(done);
  });
});
