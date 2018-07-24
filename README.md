# GOV.UK Notify Node.js client

This documentation is for developers interested in using this Node.js client to integrate their government service with GOV.UK Notify.

## Table of Contents

* [Installation](#installation)
* [Getting started](#getting-started)
* [Send messages](#send-messages)
* [Get the status of one message](#get-the-status-of-one-message)
* [Get the status of all messages](#get-the-status-of-all-messages)
* [Get a template by ID](#get-a-template-by-id)
* [Get a template by ID and version](#get-a-template-by-id-and-version)
* [Get all templates](#get-all-templates)
* [Generate a preview template](#generate-a-preview-template)
* [Tests](#tests)

## Installation

```shell
npm install --save notifications-node-client
```

## Getting started

```javascript
var NotifyClient = require('notifications-node-client').NotifyClient,
	notifyClient = new NotifyClient(apiKey);
```

Generate an API key by logging in to [GOV.UK Notify](https://www.notifications.service.gov.uk) and going to the _API integration_ page.

### Connect through a proxy (optional)

```
notifyClient.setProxy(proxyUrl);
```

## Send messages

### Text message

#### Method

<details>
<summary>
Click here to expand for more information.
</summary>

```javascript
notifyClient
	.sendSms(templateId, phoneNumber, {
			personalisation: personalisation,
			reference: reference,
			smsSenderId: smsSenderId})
	.then(response => console.log(response))
	.catch(err => console.error(err))
;
```

</details>

#### Response

If the request is successful, `response` will be an `object`.

<details>
<summary>
Click here to expand for more information.
</summary>

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

|`err.error.status_code`|`err.error.errors`|
|:---|:---|
|`429`|`[{`<br>`"error": "RateLimitError",`<br>`"message": "Exceeded rate limit for key type TEAM of 10 requests per 10 seconds"`<br>`}]`|
|`429`|`[{`<br>`"error": "TooManyRequestsError",`<br>`"message": "Exceeded send limits (50) for today"`<br>`}]`|
|`400`|`[{`<br>`"error": "BadRequestError",`<br>`"message": "Can"t send to this recipient using a team-only API key"`<br>`]}`|
|`400`|`[{`<br>`"error": "BadRequestError",`<br>`"message": "Can"t send to this recipient when service is in trial mode - see https://www.notifications.service.gov.uk/trial-mode"`<br>`}]`|

</details>

#### Arguments

<details>
<summary>
Click here to expand for more information.
</summary>

##### `phoneNumber`

The phone number of the recipient, only required for sms notifications.

##### `templateId`

Find by clicking **API info** for the template you want to send.

##### `options`
###### `reference`

An optional identifier you generate. The `reference` can be used as a unique reference for the notification. Because Notify does not require this reference to be unique you could also use this reference to identify a batch or group of notifications.

You can omit this argument if you do not require a reference for the notification.

##### `personalisation`

If a template has placeholders, you need to provide their values, for example:

```javascript
personalisation={
    'first_name': 'Amala',
    'reference_number': '300241',
}
```

This does not need to be provided if your template does not contain placeholders.

##### `smsSenderId`

Optional. Specifies the identifier of the sms sender to set for the notification. The identifiers are found in your service Settings, when you 'Manage' your 'Text message sender'.

If you omit this argument your default sms sender will be set for the notification.

Example usage with optional reference -

</details>


### Email

#### Method

<details>
<summary>
Click here to expand for more information.
</summary>

```javascript
notifyClient
	.sendEmail(templateId, emailAddress, {
			personalisation: personalisation,
			reference: reference,
			emailReplyToId: emailReplyToId})
    .then(response => console.log(response))
    .catch(err => console.error(err))
;
```

</details>


#### Response

If the request is successful, `response` will be an `object`.

<details>
<summary>
Click here to expand for more information.
</summary>

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
Otherwise the client will return an error `error object`:

|`status_code`|`errors`|
|:---|:---|
|`429`|`[{`<br>`"error": "RateLimitError",`<br>`"message": "Exceeded rate limit for key type TEAM of 10 requests per 10 seconds"`<br>`}]`|
|`429`|`[{`<br>`"error": "TooManyRequestsError",`<br>`"message": "Exceeded send limits (50) for today"`<br>`}]`|
|`400`|`[{`<br>`"error": "BadRequestError",`<br>`"message": "Can"t send to this recipient using a team-only API key"`<br>`]}`|
|`400`|`[{`<br>`"error": "BadRequestError",`<br>`"message": "Can"t send to this recipient when service is in trial mode - see https://www.notifications.service.gov.uk/trial-mode"`<br>`}]`|

</details>


#### Arguments

<details>
<summary>
Click here to expand for more information.
</summary>

##### `emailAddress`

The email address of the recipient, only required for email notifications.

##### `templateId`

Find by clicking **API info** for the template you want to send.

##### `options`
###### `reference`

An optional identifier you generate. The `reference` can be used as a unique reference for the notification. Because Notify does not require this reference to be unique you could also use this reference to identify a batch or group of notifications.

You can omit this argument if you do not require a reference for the notification.

###### `emailReplyToId`

Optional. Specifies the identifier of the email reply-to address to set for the notification. The identifiers are found in your service Settings, when you 'Manage' your 'Email reply to addresses'.

If you omit this argument your default email reply-to address will be set for the notification.

###### `personalisation`

If a template has placeholders, you need to provide their values, for example:

```javascript
personalisation={
    'first_name': 'Amala',
    'application_number': '300241',
}
```

##### `emailReplyToId`

Optional. Specifies the identifier of the email reply-to address to set for the notification. The identifiers are found in your service Settings, when you 'Manage' your 'Email reply to addresses'.
If you omit this argument your default email reply-to address will be set for the notification.

</details>


### Letter

#### Method

<details>
<summary>
Click here to expand for more information.
</summary>

```javascript
notifyClient
    .sendLetter(templateId, {
				personalisation: personalisation,
				reference: reference})
    .then(response => console.log(response))
    .catch(err => console.error object)
;
```

where `personalisation` is

```javascript
personalisation={
    address_line_1: 'The Occupier',  // required
    address_line_2: '123 High Street', // required
    address_line_3: 'London',
    postcode: 'SW14 6BH',  // required

    // ... any other optional address lines, or personalisation fields found in your template
},
```
</details>


#### Response

If the request is successful, `response` will be an `object`:

<details>
<summary>
Click here to expand for more information.
</summary>

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

|`status_code`|`errors`|
|:---|:---|
|`429`|`[{`<br>`"error": "RateLimitError",`<br>`"message": "Exceeded rate limit for key type live of 10 requests per 20 seconds"`<br>`}]`|
|`429`|`[{`<br>`"error": "TooManyRequestsError",`<br>`"message": "Exceeded send limits (50) for today"`<br>`}]`|
|`400`|`[{`<br>`"error": "BadRequestError",`<br>`"message": "Cannot send letters with a team api key"`<br>`]}`|
|`400`|`[{`<br>`"error": "BadRequestError",`<br>`"message": "Cannot send letters when service is in trial mode - see https://www.notifications.service.gov.uk/trial-mode"`<br>`}]`|
|`400`|`[{`<br>`"error": "ValidationError",`<br>`"message": "personalisation address_line_1 is a required property"`<br>`}]`|

</details>


#### Arguments

<details>
<summary>
Click here to expand for more information.
</summary>

##### `template_id`

Find by clicking **API info** for the template you want to send.

##### `reference`

An optional identifier you generate. The `reference` can be used as a unique reference for the notification. Because Notify does not require this reference to be unique you could also use this reference to identify a batch or group of notifications.

You can omit this argument if you do not require a reference for the notification.

##### `personalisation`

The letter must contain:

- mandatory address fields
- optional address fields if applicable
- fields from template

```javascript
personalisation={
  address_line_1: 'The Occupier',  // mandatory address field
  address_line_2: 'Flat 2',  // mandatory address field
  address_line_3: '123 High Street',  // optional address field
  address_line_4: 'Richmond upon Thames',  // optional address field
  address_line_5: 'London',  // optional address field
  address_line_6: 'Middlesex',  // optional address field
  postcode: 'SW14 6BH',  // mandatory address field
  application_id: '1234',  // field from template
  application_date: '2017-01-01',  // field from template
}
```

</details>


## Get the status of one message

#### Method

<details>
<summary>
Click here to expand for more information.
</summary>

```javascript
notifyClient
	.getNotificationById(notificationId)
	.then((response) => { })
	.catch((err) => {})
;
```

</details>


#### Response

<details>
<summary>
Click here to expand for more information.
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
    "created_by_name": "name of the person who sent the notification if sent manually",
    "created_at": "created at",
    "sent_at": "sent to provider at",
}
```

Otherwise the client will return an error `error object`:

|`status_code`|`errors`|
|:---|:---|
|`404`|`[{`<br>`"error": "NoResultFound",`<br>`"message": "No result found"`<br>`}]`|
|`400`|`[{`<br>`"error": "ValidationError",`<br>`"message": "id is not a valid UUID"`<br>`}]`|

</details>

#### Arguments

<details>
<summary>
Click here to expand for more information.
</summary>

##### `notificationId`

The ID of the notification.

</details>

## Get the status of all messages

#### Method

<details>
<summary>
Click here to expand for more information.
</summary>

```javascript
notifyClient
	.getNotifications(templateType, status, reference, olderThan)
	.then((response) => { })
	.catch((err) => {})
;
```
</details>


#### Response

If the request is successful, `response` will be an `object`.

<details>
<summary>
Click here to expand for more information.
</summary>

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
       "created_by_name": "name of the person who sent the notification if sent manually",
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

|`status_code`|`errors`|
|:---|:---|
|`400`|`[{`<br>`"error": "ValidationError",`<br>`"message": "bad status is not one of [created, sending, delivered, pending, failed, technical-failure, temporary-failure, permanent-failure]"`<br>`}]`|
|`400`|`[{`<br>`"error": "Apple is not one of [sms, email, letter]"`<br>`}]`|

</details>


#### Arguments

<details>
<summary>
Click here to expand for more information.
</summary>

##### `templateType`

If omitted all messages are returned. Otherwise you can filter by:

* `email`
* `sms`
* `letter`

##### `status`

__email__

You can filter by:

* `sending` - the message is queued to be sent by the provider.
* `delivered` - the message was successfully delivered.
* `failed` - this will return all failure statuses `permanent-failure`, `temporary-failure` and `technical-failure`.
* `permanent-failure` - the provider was unable to deliver message, email does not exist; remove this recipient from your list.
* `temporary-failure` - the provider was unable to deliver message, email box was full; you can try to send the message again.
* `technical-failure` - Notify had a technical failure; you can try to send the message again.

You can omit this argument to ignore this filter.

__text message__

You can filter by:

* `sending` - the message is queued to be sent by the provider.
* `delivered` - the message was successfully delivered.
* `failed` - this will return all failure statuses `permanent-failure`, `temporary-failure` and `technical-failure`.
* `permanent-failure` - the provider was unable to deliver message, phone number does not exist; remove this recipient from your list.
* `temporary-failure` - the provider was unable to deliver message, the phone was turned off; you can try to send the message again.
* `technical-failure` - Notify had a technical failure; you can try to send the message again.

You can omit this argument to ignore this filter.

__letter__

You can filter by:

* `accepted` - Notify is in the process of printing and posting the letter
* `technical-failure` - Notify had an unexpected error while sending to our printing provider

You can omit this argument to ignore this filter.

##### `reference`

This is the `reference` you gave at the time of sending the notification. This can be omitted to ignore the filter.

##### `olderThan`

If omitted all messages are returned. Otherwise you can filter to retrieve all notifications older than the given notification `id`.

</details>


## Get a template by ID

#### Method

<details>
<summary>
Click here to expand for more information.
</summary>

```javascript
notifyClient
    .getTemplateById(templateId)
    .then((response) => { })
    .catch((err) => {})
;
```

</details>


#### Response

If the request is successful, `response` will be an `object`.

<details>
<summary>
Click here to expand for more information.
</summary>

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

Otherwise the client will return an error `error object`:

|`status_code`|`errors`|
|:---|:---|
|`404`|`[{`<br>`"error": "NoResultFound",`<br>`"message": "No result found"`<br>`}]`|

</details>


#### Arguments

<details>
<summary>
Click here to expand for more information.
</summary>

##### `templateId`

Find by clicking **API info** for the template you want to send.

</details>


## Get a template by ID and version

#### Method

<details>
<summary>
Click here to expand for more information.
</summary>

```javascript
notifyClient
    .getTemplateByIdAndVersion(templateId, version)
    .then((response) => { })
    .catch((err) => {})
;
```

</details>


#### Response

If the request is successful, `response` will be an `object`.

<details>
<summary>
Click here to expand for more information.
</summary>

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
Otherwise the client will return an error `error object`:

|`status_code`|`errors`|
|:---|:---|
|`404`|`[{`<br>`"error": "NoResultFound",`<br>`"No result found"`<br>`}]`|

</details>


#### Arguments

<details>
<summary>
Click here to expand for more information.
</summary>

##### `templateId`

Find by clicking **API info** for the template you want to send.

##### `version`

The version number of the template

</details>

## Get all templates

#### Method

<details>
<summary>
Click here to expand for more information.
</summary>

```javascript
notifyClient
    .getAllTemplates(templateType)
    .then((response) => { })
    .catch((err) => {})
;
```
This will return the latest version for each template.

</details>


#### Response

If the request is successful, `response` will be an `object`.

<details>
<summary>
Click here to expand for more information.
</summary>

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


#### Arguments

<details>
<summary>
Click here to expand for more information.
</summary>

##### `templateType`

If omitted all messages are returned. Otherwise you can filter by:

* `email`
* `sms`
* `letter`

</details>


## Generate a preview template

#### Method

<details>
<summary>
Click here to expand for more information.
</summary>

```javascript
personalisation = { "foo": "bar" };
notifyClient
    .previewTemplateById(templateId, personalisation)
    .then((response) => { })
    .catch((err) => {})
;
```

</details>


#### Response

<details>
<summary>
Click here to expand for more information.
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

Otherwise the client will return an error `error object`:

|`status_code`|`errors`|
|:---|:---|
|`400`|`[{`<br>`"error": "BadRequestError",`<br>`"Missing personalisation: [name]"`<br>`}]`|
|`404`|`[{`<br>`"error": "NoResultFound",`<br>`"No result found"`<br>`}]`|

</details>


#### Arguments

<details>
<summary>
Click here to expand for more information.
</summary>

##### `templateId`

Find by clicking **API info** for the template you want to send.

##### `personalisation`

If a template has placeholders you need to provide their values. For example:

```javascript
personalisation={
    'first_name': 'Amala',
    'reference_number': '300241',
}
```

Otherwise the parameter can be omitted or `undefined` can be passed in its place.

</details>

## Get received text messages with pagination

This will return one page of text messages (250) per call.

#### Method

<details>
<summary>
Click here to expand for more information.
</summary>

```javascript
notifyClient
    .getReceivedTexts(olderThan)
    .then((response) => { })
    .catch((err) => {})
;
```

</details>


#### Response

<details>
<summary>
Click here to expand for more information.
</summary>

If the request is successful, `response` will be a `json object`:

```javascript
{
  "received_text_messages":
    [
      {
        "id": "notify_id", // required
        "user_number": "user number", // required user number
        "notify_number": "notify number", // receiving number
        "created_at": "created at", // required
        "service_id": "service id", // required service id
        "content": "text content" // required text content
      },
      …
    ],
  "links": {
    "current": "/received-test-messages",
    "next": "/received-text-messages?older_than=last_id_in_list"
  }
}
```

</details>


#### Arguments

<details>
<summary>
Click here to expand for more information.
</summary>

##### `olderThan`

If omitted, returns 250 of the latest received text messages. Otherwise the next 250 received text messages older than the given id are returned.

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
