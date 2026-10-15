var expect = require('chai').expect,
  MockDate = require('mockdate'),
  ApiClient = require('../client/api_client.js'),
  createGovukNotifyToken = require('../client/authentication.js'),
  version = require('../package.json').version,
  sinon = require('sinon');
const { MockAgent, setGlobalDispatcher, getGlobalDispatcher } = require('undici');

describe('api client', function () {
  const responseOptions =  {headers: {'Content-Type': 'application/json'}};

  beforeEach(function() {
    MockDate.set(1234567890000);
  });

  afterEach(function() {
    MockDate.reset();
  });

  function newMockAgent(baseUrl) {
      // intercept requests with undici's MockAgent
      const mockAgent = new MockAgent();
      const dispatcher = getGlobalDispatcher();
      setGlobalDispatcher(mockAgent);
      const mockPool = mockAgent.get(baseUrl);
      return {
          mockPool,
          reset() {
              // restore the global dispatcher
              setGlobalDispatcher(dispatcher);
          }
      }
  }

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
        const { mockPool, reset } = newMockAgent(urlBase);
        mockPool
          .intercept({
            path,
            headers: {
              'Authorization': 'Bearer ' + createGovukNotifyToken('GET', path, apiKeyId, serviceId),
              'Content-Type': 'application/json',
              'User-Agent': 'NOTIFY-API-NODE-CLIENT/' + version
            }
          })
          .reply(200, body, responseOptions)

        client
          .get(path)
          .then(function (response) {
            expect(response.data).to.deep.equal(body);
            if (index == clients.length - 1) done();
          })
          .finally(reset);
    });

  });

  it('should make a post request with correct headers', function (done) {
      var urlBase = 'http://localhost',
          path = '/email',
          data = {
              'data': 'qwjjs'
          },
          serviceId = 123,
          apiKeyId = 'SECRET';

      const { mockPool, reset } = newMockAgent(urlBase);
      mockPool
       .intercept({
         path,
         method: 'POST',
         headers: {
           'Authorization': 'Bearer ' + createGovukNotifyToken('POST', path, apiKeyId, serviceId),
           'Content-Type': 'application/json',
           'User-Agent': 'NOTIFY-API-NODE-CLIENT/' + version
         }
       })
       .reply(200, {"hooray": "bkbbk"}, responseOptions)

      const apiClient = new ApiClient(urlBase, serviceId, apiKeyId);
      apiClient.post(path, data)
       .then(function (response) {
         expect(response.status).to.equal(200);
         done();
       })
       .catch(done)
       .finally(reset);
  });

  it('should direct get requests through the proxy when set', function (done) {
    var urlBase = 'http://api.notifications.service.gov.uk',
      path = '/email',
      apiClient = new ApiClient(urlBase, 'apiKey');

    const mockAgent = new MockAgent()
    const mockPool = mockAgent.get(urlBase)
    mockPool
      .intercept({ path })
      .reply(200, 'test')

    apiClient.setProxy(mockAgent);
    apiClient.get(path)
      .then(function (response) {
        expect(response.status).to.equal(200);
        expect(response.data).to.equal('test');
        done();
      })
      .catch(done);
  });

  it('should direct post requests through the proxy when set', function (done) {
    var urlBase = 'http://api.notifications.service.gov.uk',
      path = '/email',
      apiClient = new ApiClient(urlBase, 'apiKey');

    const mockAgent = new MockAgent()
    const mockPool = mockAgent.get(urlBase)
    mockPool
     .intercept({
         method: 'POST',
         path
     })
     .reply(200, 'test')

    apiClient.setProxy(mockAgent);
    apiClient.post(path)
      .then(function (response) {
        expect(response.status).to.equal(200);
        expect(response.data).to.equal('test');
        done();
      })
      .catch(done);
  });

  it('should use the custom Axios client when set', function (done) {
    var urlBase = 'https://api.notifications.service.gov.uk',
      path = '/email',
      body = {
        'body': 'body text'
      },
      serviceId = 'c745a8d8-b48a-4b0d-96e5-dbea0165ebd1',
      apiKeyId = '8b3aa916-ec82-434e-b0c5-d5d9b371d6a3';

    var customClientStub = sinon.stub().resolves({
        json: () => Promise.resolve(body),
        ok: true,
        headers: {
            get() {
                return 'application/json'
            }
        }
    });

    var apiClient = new ApiClient(serviceId, apiKeyId);
    apiClient.setClient(customClientStub);

    apiClient.get(path)
      .then(function (response) {
        expect(response.data).to.deep.equal(body);
        expect(customClientStub.calledOnce).to.be.true;
        expect(customClientStub.args[0][0]).to.equal(urlBase + path);
        expect(customClientStub.args[0][1].headers['Authorization']).to.equal('Bearer ' + createGovukNotifyToken('GET', path, apiKeyId, serviceId));
        expect(customClientStub.args[0][1].headers['User-Agent']).to.equal('NOTIFY-API-NODE-CLIENT/' + version);
        done();
      })
      .catch(done);
  });

  it('should throw a helpful error when constructed without an API key', function () {
    expect(function () { new ApiClient(); }).to.throw('API key is required');
  });

  it('should throw a helpful error when the API key is undefined', function () {
    expect(function () { new ApiClient(undefined); }).to.throw('API key is required');
  });

  it('should throw a helpful error when the API key is missing alongside a base URL', function () {
    expect(function () { new ApiClient('https://api.example.com', undefined); }).to.throw('API key is required');
  });
});
