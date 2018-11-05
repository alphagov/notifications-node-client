# GOV.UK Notify Node.js client

Use this client to send emails, text messages and letters using the [GOV.UK Notify](https://www.notifications.service.gov.uk) API.

Useful links:

- [Documentation](https://docs.notifications.service.gov.uk/node.html)
- [NPM package](https://www.npmjs.com/package/notifications-node-client)
- [Changelog](https://github.com/alphagov/notifications-node-client/blob/master/CHANGELOG.md)
- [Contributing to this client](https://github.com/alphagov/notifications-node-client/blob/master/CONTRIBUTING.md)

## Testing JavaScript examples in Markdown

We automatically test that the JavaScript in the documentation examples matched [our linting standards](https://gds-way.cloudapps.digital/manuals/programming-languages/nodejs/#source-formatting-and-linting),
this also catches some issues that could stop an example from running when copied.

To test the JavaScript for syntax and linting errors run:

```
npm run test:markdown:standard
```

You can then fix some issues automatically by running:

```
npm run test:markdown:standard -- --fix
```