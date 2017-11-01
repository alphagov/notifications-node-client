[![Dependency Status](https://david-dm.org/alphagov/notifications-node-client.svg)](https://david-dm.org/alphagov/notifications-node-client)

# GOV.UK Notify Node.js client

## Installation
```shell
npm install --save notifications-node-client
```

## Getting started
```javascript
var NotifyClient = require('notifications-node-client').NotifyClient,
	notifyClient = new NotifyClient(apiKey);
```

Generate an API key by logging in to
[GOV.UK Notify](https://www.notifications.service.gov.uk) and going to
the _API integration_ page.

### Connect through a proxy (optional)
```
notifyClient.setProxy(proxyUrl);
```

## Send messages

### Text message

```javascript
notifyClient
	.sendSms(templateId, phoneNumber, personalisation, reference, smsSenderId)
	.then(response => console.log(response))
	.catch(err => console.error(err))
;
```

<details>
<summary>
Response
</summary>

If the request is successful, `response` will be an `object`:

```javascript
{
    "id": "bfb50d92-100d-4b8b-b559-14fa3b091cda",
    "reference": null,
    "content": {
        "body": "Some words",
        "from_number": "40604"
    },
    "uri": "https://api.notifications.service.gov.uk/v2/notifications/ceb50d92-100d-4b8b-b559-14fa3b091cd",
    "template": {
        "id": "ceb50d92-100d-4b8b-b559-14fa3b091cda",
       "version": 1,
       "uri": "https://api.notifications.service.gov.uk/v2/templates/bfb50d92-100d-4b8b-b559-14fa3b091cda"
    }
}
```

Otherwise the client will return an error `err`:
<table>
<thead>
<tr>
<th>`err.error.status_code`</th>
<th>`err.error.errors`</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<pre>429</pre>
</td>
<td>
<pre>
[{
    "error": "RateLimitError",
    "message": "Exceeded rate limit for key type TEAM of 10 requests per 10 seconds"
}]
</pre>
</td>
</tr>
<tr>
<td>
<pre>429</pre>
</td>
<td>
<pre>
[{
    "error": "TooManyRequestsError",
    "message": "Exceeded send limits (50) for today"
}]
</pre>
</td>
</tr>
<tr>
<td>
<pre>400</pre>
</td>
<td>
<pre>
[{
    "error": "BadRequestError",
    "message": "Can"t send to this recipient using a team-only API key"
]}
</pre>
</td>
</tr>
<tr>
<td>
<pre>400</pre>
</td>
<td>
<pre>
[{
    "error": "BadRequestError",
    "message": "Can"t send to this recipient when service is in trial mode
                - see https://www.notifications.service.gov.uk/trial-mode"
}]
</pre>
</td>
</tr>
</tbody>
</table>
</details>

<details>
<summary>
Arguments
</summary>

#### `phoneNumber`

The phone number of the recipient, only required for sms notifications.

#### `templateId`

Find by clicking **API info** for the template you want to send.

#### `reference`

An optional identifier you generate. The `reference` can be used as a unique reference for the notification. Because Notify does not require this reference to be unique you could also use this reference to identify a batch or group of notifications.

You can omit this argument if you do not require a reference for the notification.


#### `personalisation`

If a template has placeholders, you need to provide their values, for example:

```javascript
personalisation={
    'first_name': 'Amala',
    'reference_number': '300241',
}
```

If you are not using the `smsSenderId` argument, this parameter can be omitted. Otherwise `undefined` should be passed in its place.

#### `smsSenderId`

Optional. Specifies the identifier of the sms sender to set for the notification. The identifiers are found in your service Settings, when you 'Manage' your 'Text message sender'.

If you omit this argument your default sms sender will be set for the notification.

If other optional arguments before `smsSenderId` are not in use they need to be set to `undefined`.

Example usage with optional reference -

```
sendSms('123', '+447900900123', undefined, 'your ref', '465')
```

Example usage with optional personalisation -

```
sendSms('123', '+447900900123', '{"name": "test"}', undefined, '465')
```

Example usage with only optional `smsSenderId` set -

```
sendSms('123', '+447900900123', undefined, undefined, '465')
```

</details>

### Email

```javascript
notifyClient
	.sendEmail(templateId, emailAddress, personalisation, reference, emailReplyToId)
    .then(response => console.log(response))
    .catch(err => console.error(err))
;
```

<details>
<summary>
Response
</summary>

If the request is successful, `response` will be an `object`:

```javascript
{
    "id": "bfb50d92-100d-4b8b-b559-14fa3b091cda",
    "reference": null,
    "content": {
        "subject": "Licence renewal",
        "body": "Dear Bill, your licence is due for renewal on 3 January 2016.",
        "from_email": "the_service@gov.uk"
    },
    "uri": "https://api.notifications.service.gov.uk/v2/notifications/ceb50d92-100d-4b8b-b559-14fa3b091cd",
    "template": {
        "id": "ceb50d92-100d-4b8b-b559-14fa3b091cda",
        "version": 1,
        "uri": "https://api.notificaitons.service.gov.uk/service/your_service_id/templates/bfb50d92-100d-4b8b-b559-14fa3b091cda"
    }
}
```

Otherwise the client will return an error `err`:
<table>
<thead>
<tr>
<th>`err.error.status_code`</th>
<th>`err.error.errors`</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<pre>429</pre>
</td>
<td>
<pre>
[{
    "error": "RateLimitError",
    "message": "Exceeded rate limit for key type TEAM of 10 requests per 10 seconds"
}]
</pre>
</td>
</tr>
<tr>
<td>
<pre>429</pre>
</td>
<td>
<pre>
[{
    "error": "TooManyRequestsError",
    "message": "Exceeded send limits (50) for today"
}]
</pre>
</td>
</tr>
<tr>
<td>
<pre>400</pre>
</td>
<td>
<pre>
[{
    "error": "BadRequestError",
    "message": "Can"t send to this recipient using a team-only API key"
]}
</pre>
</td>
</tr>
<tr>
<td>
<pre>400</pre>
</td>
<td>
<pre>
[{
    "error": "BadRequestError",
    "message": "Can"t send to this recipient when service is in trial mode
                - see https://www.notifications.service.gov.uk/trial-mode"
}]
</pre>
</td>
</tr>
</tbody>
</table>
</details>

<details>
<summary>Arguments</summary>

#### `emailAddress`
The email address of the recipient, only required for email notifications.

#### `templateId`

Find by clicking **API info** for the template you want to send.

#### `reference`

An optional identifier you generate. The `reference` can be used as a unique reference for the notification. Because Notify does not require this reference to be unique you could also use this reference to identify a batch or group of notifications.

You can omit this argument if you do not require a reference for the notification.

#### `emailReplyToId`

Optional. Specifies the identifier of the email reply-to address to set for the notification. The identifiers are found in your service Settings, when you 'Manage' your 'Email reply to addresses'. 

If you omit this argument your default email reply-to address will be set for the notification.

If other optional arguments before `emailReplyToId` are not in use they need to be set to `undefined`.

Example usage with optional reference -

```
sendEmail('123', 'test@gov.uk', undefined, 'your ref', '465')
```

Example usage with optional personalisation -

```
sendEmail('123', 'test@gov.uk', '{"name": "test"}', undefined, '465')
```

Example usage with only optional `emailReplyToId` set -

```
sendEmail('123', 'test@gov.uk', undefined, undefined, '465')
```

#### `personalisation`

If a template has placeholders, you need to provide their values, for example:

```javascript
personalisation={
    'first_name': 'Amala',
    'application_number': '300241',
}
```

Otherwise the parameter can be omitted or `undefined` can be passed in its place.

</details>

### Letter

```javascript
notifyClient
    .sendLetter(templateId, personalisation, reference)
    .then(response => console.log(response))
    .catch(err => console.error(err))
;
```

where `personalisation` is

```javascript
personalisation={
    'address_line_1': 'The Occupier',  # required
    'address_line_2': '123 High Street', # required
    'address_line_3': 'London',
    'postcode': 'SW14 6BH',  # required

    ... # any other optional address lines, or personalisation fields found in your template
},
```

<details>
<summary>
Response
</summary>

If the request is successful, `response` will be an `object`:

```javascript
{
  "id": "740e5834-3a29-46b4-9a6f-16142fde533a",
  "reference": null,
  "content": {
    "subject": "Licence renewal",
    "body": "Dear Bill, your licence is due for renewal on 3 January 2016.",
  },
  "uri": "https://api.notifications.service.gov.uk/v2/notifications/740e5834-3a29-46b4-9a6f-16142fde533a",
  "template": {
    "id": "f33517ff-2a88-4f6e-b855-c550268ce08a",
    "version": 1,
    "uri": "https://api.notifications.service.gov.uk/v2/template/f33517ff-2a88-4f6e-b855-c550268ce08a"
  }
  "scheduled_for": null
}
```

Otherwise the client will raise a `HTTPError`:
<table>
<thead>
<tr>
<th>`error.status_code`</th>
<th>`error.message`</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<pre>429</pre>
</td>
<td>
<pre>
[{
    "error": "RateLimitError",
    "message": "Exceeded rate limit for key type live of 10 requests per 20 seconds"
}]
</pre>
</td>
</tr>
<tr>
<td>
<pre>429</pre>
</td>
<td>
<pre>
[{
    "error": "TooManyRequestsError",
    "message": "Exceeded send limits (50) for today"
}]
</pre>
</td>
</tr>
<tr>
<td>
<pre>400</pre>
</td>
<td>
<pre>
[{
    "error": "BadRequestError",
    "message": "Cannot send letters with a team api key"
]}
</pre>
</td>
</tr>
<tr>
<td>
<pre>400</pre>
</td>
<td>
<pre>
[{
    "error": "BadRequestError",
    "message": "Cannot send letters when service is in trial mode"
}]
</pre>
</td>
</tr>
<tr>
<td>
<pre>400</pre>
</td>
<td>
<pre>
[{
    "error": "ValidationError",
    "message": "personalisation address_line_1 is a required property"
}]
</pre>
</td>
</tr>
</tbody>
</table>
</details>

<details>
<summary>Arguments</summary>


#### `template_id`

Find by clicking **API info** for the template you want to send.

#### `reference`

An optional identifier you generate. The `reference` can be used as a unique reference for the notification. Because Notify does not require this reference to be unique you could also use this reference to identify a batch or group of notifications.

You can omit this argument if you do not require a reference for the notification.

#### `personalisation`

The letter must contain:

- mandatory address fields
- optional address fields if applicable
- fields from template

```javascript
personalisation={
    'address_line_1': 'The Occupier', 		# mandatory address field
    'address_line_2': 'Flat 2', 		# mandatory address field
    'address_line_3': '123 High Street', 	# optional address field
    'address_line_4': 'Richmond upon Thames', 	# optional address field
    'address_line_5': 'London', 		# optional address field
    'address_line_6': 'Middlesex', 		# optional address field
    'postcode': 'SW14 6BH', 			# mandatory address field
    'application_id': '1234', 			# field from template
    'application_date': '2017-01-01', 		# field from template
}
```

</details>

## Get the status of one message
```javascript
notifyClient
	.getNotificationById(notificationId)
	.then((response) => { })
	.catch((err) => {})
;
```

<details>
<summary>
Response
</summary>

If the request is successful, `response` will be an `object`:

```javascript
{
    "id": "notify_id",
    "body": "Hello Foo",
    "subject": "null|email_subject",
    "reference": "client reference",
    "email_address": "email address",
    "phone_number": "phone number",
    "line_1": "full name of a person or company",
    "line_2": "123 The Street",
    "line_3": "Some Area",
    "line_4": "Some Town",
    "line_5": "Some county",
    "line_6": "Something else",
    "postcode": "postcode",
    "type": "sms|letter|email",
    "status": "current status",
    "template": {
        "version": 1,
        "id": 1,
        "uri": "/template/{id}/{version}"
     },
    "created_at": "created at",
    "sent_at": "sent to provider at",
}
```

Otherwise the client will return an error `err`:
<table>
<thead>
<tr>
<th>`err.error.status_code`</th>
<th>`err.error.errors`</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<pre>404</pre>
</td>
<td>
<pre>
[{
    "error": "NoResultFound",
    "message": "No result found"
}]
</pre>
</td>
</tr>
<tr>
<td>
<pre>400</pre>
</td>
<td>
<pre>
[{
    "error": "ValidationError",
    "message": "id is not a valid UUID"
}]
</pre>
</td>
</tr>
</tbody>
</table>
</details>

## Get the status of all messages
```javascript
notifyClient
	.getNotifications(templateType, status, reference, olderThan)
	.then((response) => { })
	.catch((err) => {})
;
```

<details>
<summary>
Response
</summary>

If the request is successful, `response` will be an `object`:

```javascript
{ "notifications":
    [{
        "id": "notify_id",
        "reference": "client reference",
        "email_address": "email address",
        "phone_number": "phone number",
        "line_1": "full name of a person or company",
        "line_2": "123 The Street",
        "line_3": "Some Area",
        "line_4": "Some Town",
        "line_5": "Some county",
        "line_6": "Something else",
        "postcode": "postcode",
        "type": "sms | letter | email",
        "status": sending | delivered | permanent-failure | temporary-failure | technical-failure
        "template": {
            "version": 1,
          "id": 1,
          "uri": "/template/{id}/{version}"
       },
       "created_at": "created at",
       "sent_at": "sent to provider at",
    },
    …
  ],
  "links": {
     "current": "/notifications?template_type=sms&status=delivered",
     "next": "/notifications?other_than=last_id_in_list&template_type=sms&status=delivered"
  }
}
```

Otherwise the client will return an error `err`:
<table>
<thead>
<tr>
<th>`err.error.status_code`</th>
<th>`err.error.errors`</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<pre>400</pre>
</td>
<td>
<pre>
[{
    'error': 'ValidationError',
    'message': 'bad status is not one of [created, sending, delivered, pending, failed, technical-failure, temporary-failure, permanent-failure]'
}]
</pre>
</td>
</tr>
<tr>
<td>
<pre>400</pre>
</td>
<td>
<pre>
[{
    "error": "ValidationError",
    "message": "Apple is not one of [sms, email, letter]"
}]
</pre>
</td>
</tr>
</tbody>
</table>
</details>

<details>
<summary>Arguments</summary>

#### `templateType`

If omitted all messages are returned. Otherwise you can filter by:

* `email`
* `sms`
* `letter`


#### `status`

If omitted all messages are returned. Otherwise you can filter by:

* `sending` - the message is queued to be sent by the provider.
* `delivered` - the message was successfully delivered.
* `failed` - this will return all failure statuses `permanent-failure`, `temporary-failure` and `technical-failure`.
* `permanent-failure` - the provider was unable to deliver message, email or phone number does not exist; remove this recipient from your list.
* `temporary-failure` - the provider was unable to deliver message, email box was full or the phone was turned off; you can try to send the message again.
* `technical-failure` - Notify had a technical failure; you can try to send the message again.

#### `reference`


This is the `reference` you gave at the time of sending the notification. This can be omitted to ignore the filter.

#### `olderThan`

If omitted all messages are returned. Otherwise you can filter to retrieve all notifications older than the given notification `id`.
</details>

## Get a template by ID

```javascript
notifyClient
    .getTemplateById(templateId)
    .then((response) => { })
    .catch((err) => {})
;
```

<details>
<summary>
Response
</summary>

If the request is successful, `response` will be an `object`:

```javascript
{
    "id": "template_id",
    "type": "sms|email|letter",
    "created_at": "created at",
    "updated_at": "updated at",
    "version": "version",
    "created_by": "someone@example.com",
    "body": "body",
    "subject": "null|email_subject"
}
```

Otherwise the client will return an error `err`:
<table>
<thead>
<tr>
<th>`err.error.status_code`</th>
<th>`err.error.errors`</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<pre>404</pre>
</td>
<td>
<pre>
[{
    "error": "NoResultFound",
    "message": "No result found"
]}
</pre>
</td>
</tr>
</tbody>
</table>
</details>

<details>
<summary>Arguments</summary>

#### `templateId`

Find by clicking **API info** for the template you want to send.
</details>

## Get a template by ID and version

```javascript
notifyClient
    .getTemplateByIdAndVersion(templateId, version)
    .then((response) => { })
    .catch((err) => {})
;
```

<details>
<summary>
Response
</summary>

If the request is successful, `response` will be an `object`:

```javascript
{
    "id": "template_id",
    "type": "sms|email|letter",
    "created_at": "created at",
    "updated_at": "updated at",
    "version": "version",
    "created_by": "someone@example.com",
    "body": "body",
    "subject": "null|email_subject"
}
```

Otherwise the client will return an error `err`:
<table>
<thead>
<tr>
<th>`err.error.status_code`</th>
<th>`err.error.errors`</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<pre>404</pre>
</td>
<td>
<pre>
[{
    "error": "NoResultFound",
    "message": "No result found"
]}
</pre>
</td>
</tr>
</tbody>
</table>
</details>

<details>
<summary>Arguments</summary>

#### `templateId`

Find by clicking **API info** for the template you want to send.

#### `version`

The version number of the template
</details>

## Get all templates

```javascript
notifyClient
    .getAllTemplates(templateType)
    .then((response) => { })
    .catch((err) => {})
;
```
_This will return the latest version for each template_

<details>
<summary>
Response
</summary>

If the request is successful, `response` will be an `object`:

```javascript
{
    "templates" : [
        {
            "id": "template_id",
            "type": "sms|email|letter",
            "created_at": "created at",
            "updated_at": "updated at",
            "version": "version",
            "created_by": "someone@example.com",
            "body": "body",
            "subject": "null|email_subject"
        },
        {
            ... another template
        }
    ]
}
```

If no templates exist for a template type or there no templates for a service, the `response` will be an `object` with an empty `templates` list element:

```javascript
{
    "templates" : []
}
```

</details>

<details>
<summary>Arguments</summary>

#### `templateType`

If omitted all messages are returned. Otherwise you can filter by:

* `email`
* `sms`
* `letter`
</details>

## Generate a preview template

```javascript
personalisation = { "foo": "bar" };
notifyClient
    .previewTemplateById(templateId, personalisation)
    .then((response) => { })
    .catch((err) => {})
;
```
<details>
<summary>
Response
</summary>

If the request is successful, `response` will be an `object`:

```javascript
{
    "id": "notify_id",
    "type": "sms|email|letter",
    "version": "version",
    "body": "Hello bar" // with substitution values,
    "subject": "null|email_subject"
}
```

Otherwise the client will return an error `err`:
<table>
<thead>
<tr>
<th>`err.error.status_code`</th>
<th>`err.error.errors`</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<pre>400</pre>
</td>
<td>
<pre>
[{
    "error": "BadRequestError",
    "message": "Missing personalisation: [name]"
]}
</pre>
</td>
</tr>
<tr>
<td>
<pre>404</pre>
</td>
<td>
<pre>
[{
    "error": "NoResultFound",
    "message": "No result found"
]}
</pre>
</td>
</tr>
</tbody>
</table>
</details>

<details>
<summary>Arguments</summary>

#### `templateId`

Find by clicking **API info** for the template you want to send.

#### `personalisation`

If a template has placeholders you need to provide their values. For example:

```javascript
personalisation={
    'first_name': 'Amala',
    'reference_number': '300241',
}
```

Otherwise the parameter can be omitted or `undefined` can be passed in its place.
</details>

## Tests

There are unit and integration tests that can be run to test functionality of the client. You will need to have the relevant environment variables sourced to run the tests.

To run the unit tests:

```sh
npm test
```

To run the integration tests:

```sh
npm test --integration
```
