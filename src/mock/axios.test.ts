import axios from 'axios';

import { NotifyClient, NotifyClientConfiguration } from '..';

jest.mock('axios');

const mockAxios = axios as jest.Mocked<typeof axios>;

const config: NotifyClientConfiguration = {
  apiEndpoint: 'https://example.com',
  apiKeyID: '__API_KEY_ID__',
  serviceID: '__SERVICE_ID__',
};

const templateID = '__TEMPLATE_ID__';
const emailAddress = 'jeff@example.com';

describe(NotifyClient, () => {
  let client: NotifyClient;

  beforeEach(() => {
    mockAxios.request.mockClear();
    client = new NotifyClient(config);
  });

  it('should fail to make a request due to unrecognised error', async () => {
    mockAxios.request.mockImplementation(() => {
      throw new Error('something wrong with axios library');
    });

    await expect(client.sendEmail(templateID, emailAddress)).rejects.toThrow();

    try {
      await client.sendEmail(templateID, emailAddress);
    } catch (e) {
      expect(e.code).toEqual(500);
    }
  });
});
