# Contributing

Pull requests welcome.

## Working on the client locally

`npm install --save notifications-node-client`

## Tests

There are unit and integration tests that can be run to test functionality of the client.

To run the unit tests:

`make test`

## Integration Tests

Before running the integration tests, please ensure that the environment variables are set up.

```
export NOTIFY_API_URL="https://example.notify-api.url"
export API_KEY="example_API_test_key"
export FUNCTIONAL_TEST_NUMBER="valid mobile number"
export FUNCTIONAL_TEST_EMAIL="valid email address"
export EMAIL_TEMPLATE_ID="valid email_template_id"
export SMS_TEMPLATE_ID="valid sms_template_id"
export LETTER_TEMPLATE_ID="valid letter_template_id"
export EMAIL_REPLY_TO_ID="valid email reply to id"
export SMS_SENDER_ID="valid sms_sender_id - to test sending to a receiving number, so needs to be a valid number"
export API_SENDING_KEY="API_team_key for sending a SMS to a receiving number"
export INBOUND_SMS_QUERY_KEY="API_test_key to get received text messages - leave blank for local development as cannot test locally"
```


To run the integration tests:

`make integration-test`

The integration tests are used to test the contract of the response to all the api calls, ensuring the latest version of notifications-api do not break the contract of the notifications-node-client.

## Testing JavaScript examples in Markdown

We automatically test that the JavaScript in the documentation examples matched [our linting standards](https://gds-way.cloudapps.digital/manuals/programming-languages/nodejs/#source-formatting-and-linting),
this also catches some issues that could stop an example from running when copied.

To test the JavaScript for syntax and linting errors run:

`make markdown-standard-test`

You can then fix some issues automatically by running:

`make markdown-standard-test-fix`
