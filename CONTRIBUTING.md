# Contributing

Pull requests welcome.

## Setting Up

### Docker container

This app uses dependencies that are difficult to install locally. In order to make local development easy, we run app commands through a Docker container. Run the following to set this up:

```shell
make bootstrap-with-docker
```

### `environment.sh`

In the root directory of the repo, run:

```
notify-pass credentials/client-integration-tests > environment.sh
```

Unless you're part of the GOV.UK Notify team, you won't be able to run this command or the Integration Tests. However, the file still needs to exist - run `touch environment.sh` instead.

## Tests

There are unit and integration tests that can be run to test functionality of the client.

### Unit tests

To run the unit tests:

```
make test-with-docker
```

### Integration Tests

To run the integration tests:

```
make integration-test-with-docker
```

## Working on the client locally

```
npm install --save notifications-node-client
```

## Testing JavaScript examples in Markdown

We automatically test that the JavaScript in the documentation examples matches [our linting standards](https://gds-way.cloudapps.digital/manuals/programming-languages/nodejs/#source-formatting-and-linting). This also catches some issues that could stop an example from running when copied.

You can fix issues automatically by running:

```
npm run test:markdown:standard -- --fix
```
