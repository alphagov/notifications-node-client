# Contributing

Pull requests welcome.

## Working on the client locally

`npm install --save notifications-node-client`

## Tests

There are unit and integration tests that can be run to test functionality of the client.

To run the unit tests:

`Make test`

## Integration Tests

Before running the integration tests, please ensure that the environment variables are set up.

```
export SERVICE_ID="valid service id"
export NOTIFY_API_URL="https://example.notify-api.url"
export API_KEY="example_API_test_key"
export FUNCTIONAL_TEST_NUMBER="valid mobile number"
FUNCTIONAL_TEST_EMAIL "valid email address"
EMAIL_TEMPLATE_ID "valid email_template_id"
SMS_TEMPLATE_ID "valid sms_template_id"
LETTER_TEMPLATE_ID "valid letter_template_id"
EMAIL_REPLY_TO_ID "valid email reply to id"
SMS_SENDER_ID "valid sms_sender_id - to test sending to a receiving number, so needs to be a valid number"
API_SENDING_KEY "API_whitelist_key for sending an SMS to a receiving number"
INBOUND_SMS_QUERY_KEY "API_test_key to get received text messages - leave blank for local development as cannot test locally"
```


To run the integration tests:

`Make integration-test`

The integration tests are used to test the contract of the response to all the api calls, ensuring the latest version of notifications-api do not break the contract of the notifications-python-client.