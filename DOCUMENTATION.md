# Node.js client documentation

This documentation is for developers interested in using the GOV.UK Notify Node.js client to send emails, text messages or letters.

## Set up the client

### Install the client

Run the following in the command line:

```shell
npm install --save notifications-node-client
```

### Create a new instance of the client

Add this code to your application:

```javascript
var NotifyClient = require('notifications-node-client').NotifyClient

var notifyClient = new NotifyClient(apiKey)
```

To get an API key, [sign in to GOV.UK Notify](https://www.notifications.service.gov.uk/sign-in) and go to the __API integration__ page. You can find more information in the [API keys](#api-keys) section of this documentation.

#### Connect through a proxy (optional)

Add this code to your application:

```javascript
proxyConfig = {
  host: proxyHost,
  port: proxyPort
}

notifyClient.setProxy(proxyConfig)
```

where the `proxyConfig` should be an object supported by [axios](https://github.com/axios/axios).

## Send a message

You can use GOV.UK Notify to send text messages, emails (including documents) and letters.

### Send a text message

#### Method

```javascript
notifyClient
  .sendSms(templateId, phoneNumber, {
    personalisation: personalisation,
    reference: reference,
    smsSenderId: smsSenderId
  })
  .then(response => console.log(response))
  .catch(err => console.error(err))
```

The method returns a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) [external link]. The promise will either:

- resolve with a `response` if successful
- fail with an `err` if unsuccessful

#### Arguments

##### templateId (required)

To find the template ID:

1. [Sign in to GOV.UK Notify](https://www.notifications.service.gov.uk/sign-in).
1. Go to the __Templates__ page and select the relevant template.
1. Select __Copy template ID to clipboard__.

For example:

```
'f33517ff-2a88-4f6e-b855-c550268ce08a'
```

##### phoneNumber (required)

The phone number of the recipient of the text message. This number can be a UK or international number. For example:

```
'+447900900123'
```

##### personalisation (required)

If a template has placeholder fields for personalised information such as name or reference number, you must provide their values in an `object`. For example:

```javascript
{
  'first_name': 'Amala',
  'reference_number': '300241'
}
```

##### reference (required)

A unique identifier you create. This reference identifies a single unique notification or a batch of notifications. It must not contain any personal information such as name or postal address. If you do not have a reference, you must pass in an empty string or `null`. For example:

```
'your_reference_here'
```

##### smsSenderId (optional)

A unique identifier of the sender of the text message notification. For example:

```
'8e222534-7f05-4972-86e3-17c5d9f894e2'
```

To find the text message sender:

1. [Sign in to GOV.UK Notify](https://www.notifications.service.gov.uk/sign-in).
1. Go to the __Settings__ page.
1. In the __Text Messages__ section, select __Manage__ on the __Text Message sender__ row.

In this screen, you can either:

  - copy the sender ID that you want to use and paste it into the method
  - select __Change__ to change the default sender that the service will use, and select __Save__

You can leave out this argument if your service only has one text message sender, or if you want to use the default sender.

#### Response

If the request is successful, the promise resolves with a `response` `object`. For example, the `response.data` property will look like this:

```javascript
{
  'id': 'bfb50d92-100d-4b8b-b559-14fa3b091cda',
  'reference': null,
  'content': {
    'body': 'Some words',
    'from_number': '40604'
  },
  'uri': 'https://api.notifications.service.gov.uk/v2/notifications/ceb50d92-100d-4b8b-b559-14fa3b091cd',
  'template': {
    'id': 'ceb50d92-100d-4b8b-b559-14fa3b091cda',
    'version': 1,
    'uri': 'https://api.notifications.service.gov.uk/v2/templates/bfb50d92-100d-4b8b-b559-14fa3b091cda'
  }
}
```

If you are using the [test API key](#test), all your messages come back with a `delivered` status.

All messages sent using the [team and guest list](#team-and-guest-list) or [live](#live) keys appear on your dashboard.

#### Error codes

If the request is not successful, the promise fails with an `err`.

|err.response.data.status_code|err.response.data.errors|How to fix|
|:---|:---|:---|
|`400`|`[{`<br>`"error": "BadRequestError",`<br>`"message": "Can't send to this recipient using a team-only API key"`<br>`}]`|Use the correct type of [API key](#api-keys)|
|`400`|`[{`<br>`"error": "BadRequestError",`<br>`"message": "Can't send to this recipient when service is in trial mode - see https://www.notifications.service.gov.uk/trial-mode"`<br>`}]`|Your service cannot send this notification in [trial mode](https://www.notifications.service.gov.uk/features/using-notify#trial-mode)|
|`403`|`[{`<br>`"error": "AuthError",`<br>`"message": "Error: Your system clock must be accurate to within 30 seconds"`<br>`}]`|Check your system clock|
|`403`|`[{`<br>`"error": "AuthError",`<br>`"message": "Invalid token: API key not found"`<br>`}]`|Use the correct API key. Refer to [API keys](#api-keys) for more information|
|`429`|`[{`<br>`"error": "RateLimitError",`<br>`"message": "Exceeded rate limit for key type TEAM/TEST/LIVE of 3000 requests per 60 seconds"`<br>`}]`|Refer to [API rate limits](#rate-limits) for more information|
|`429`|`[{`<br>`"error": "TooManyRequestsError",`<br>`"message": "Exceeded send limits (LIMIT NUMBER) for today"`<br>`}]`|Refer to [service limits](#daily-limits) for the limit number|
|`500`|`[{`<br>`"error": "Exception",`<br>`"message": "Internal server error"`<br>`}]`|Notify was unable to process the request, resend your notification|

### Send an email

#### Method

```javascript
notifyClient
  .sendEmail(templateId, emailAddress, {
    personalisation: personalisation,
    reference: reference,
    emailReplyToId: emailReplyToId
  })
  .then(response => console.log(response))
  .catch(err => console.error(err))
```

The method returns a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) [external link]. The promise will either:

- resolve with a `response` if successful
- fail with an `err` if unsuccessful

#### Arguments

##### templateId (required)

To find the template ID:

1. [Sign in to GOV.UK Notify](https://www.notifications.service.gov.uk/sign-in).
1. Go to the __Templates__ page and select the relevant template.
1. Select __Copy template ID to clipboard__.

For example:

```
"f33517ff-2a88-4f6e-b855-c550268ce08a"
```

##### emailAddress (required)

The email address of the recipient. For example:

```
"sender@something.com"
```

##### personalisation (required)

If a template has placeholder fields for personalised information such as name or application date, you must provide their values in an `object`. For example:

```javascript
{
  personalisation: {
    'first_name': 'Amala',
    'application_number': '300241'
  }
}
```

##### reference (required)

A unique identifier you create. This reference identifies a single unique notification or a batch of notifications. It must not contain any personal information such as name or postal address. If you do not have a reference, you must pass in an empty string or `null`. For example:

```
"your_reference_here"
```

##### emailReplyToId (optional)

This is an email address specified by you to receive replies from your users. You must add at least one reply-to email address before your service can go live.

To add a reply-to email address:

1. [Sign in to GOV.UK Notify](https://www.notifications.service.gov.uk/sign-in).
1. Go to the __Settings__ page.
1. In the __Email__ section, select __Manage__ on the __Reply-to email addresses__ row.
1. Select __Add reply-to address__.
1. Enter the email address you want to use, and select __Add__.

```
emailReplyToId='8e222534-7f05-4972-86e3-17c5d9f894e2'
```

You can leave out this argument if your service only has one reply-to email address, or you want to use the default email address.

#### Response

If the request is successful, the promise resolves with a `response` `object`. For example, the `response.data` property will look like this:

```javascript
{
  'id': 'bfb50d92-100d-4b8b-b559-14fa3b091cda',
  'reference': null,
  'content': {
    'subject': 'Licence renewal',
    'body': 'Dear Bill, your licence is due for renewal on 3 January 2016.',
    'from_email': 'the_service@gov.uk'
  },
  'uri': 'https://api.notifications.service.gov.uk/v2/notifications/ceb50d92-100d-4b8b-b559-14fa3b091cd',
  'template': {
    'id': 'ceb50d92-100d-4b8b-b559-14fa3b091cda',
    'version': 1,
    'uri': 'https://api.notificaitons.service.gov.uk/service/your_service_id/templates/bfb50d92-100d-4b8b-b559-14fa3b091cda'
  }
}
```

#### Error codes

If the request is not successful, the promise fails with an `err`.

|err.response.data.status_code|err.response.data.errors|How to fix|
|:--- |:---|:---|
|`400`|`[{`<br>`"error": "BadRequestError",`<br>`"message": "Can't send to this recipient using a team-only API key"`<br>`}]`|Use the correct type of [API key](#api-keys)|
|`400`|`[{`<br>`"error": "BadRequestError",`<br>`"message": "Can't send to this recipient when service is in trial mode - see https://www.notifications.service.gov.uk/trial-mode"`<br>`}]`|Your service cannot send this notification in [trial mode](https://www.notifications.service.gov.uk/features/using-notify#trial-mode)|
|`403`|`[{`<br>`"error": "AuthError",`<br>`"message": "Error: Your system clock must be accurate to within 30 seconds"`<br>`}]`|Check your system clock|
|`403`|`[{`<br>`"error": "AuthError",`<br>`"message": "Invalid token: API key not found"`<br>`}]`|Use the correct API key. Refer to [API keys](#api-keys) for more information|
|`429`|`[{`<br>`"error": "RateLimitError",`<br>`"message": "Exceeded rate limit for key type TEAM/TEST/LIVE of 3000 requests per 60 seconds"`<br>`}]`|Refer to [API rate limits](#rate-limits) for more information|
|`429`|`[{`<br>`"error": "TooManyRequestsError",`<br>`"message": "Exceeded send limits (LIMIT NUMBER) for today"`<br>`}]`|Refer to [service limits](#daily-limits) for the limit number|
|`500`|`[{`<br>`"error": "Exception",`<br>`"message": "Internal server error"`<br>`}]`|Notify was unable to process the request, resend your notification|

### Send a file by email

To send a file by email, add a placeholder to the template then upload a file. The placeholder will contain a secure link to download the file.

The links are unique and unguessable. GOV.UK Notify cannot access or decrypt your file.

#### Add contact details to the file download page

1. [Sign in to GOV.UK Notify](https://www.notifications.service.gov.uk/sign-in).
1. Go to the __Settings__ page.
1. In the __Email__ section, select __Manage__ on the __Send files by email__ row.
1. Enter the contact details you want to use, and select __Save__.

#### Add a placeholder to the template

1. [Sign in to GOV.UK Notify](https://www.notifications.service.gov.uk/sign-in).
1. Go to the __Templates__ page and select the relevant email template.
1. Select __Edit__.
1. Add a placeholder to the email template using double brackets. For example:

"Download your file at: ((link_to_file))"

#### Upload your file

You can upload PDF, CSV, .odt, .txt, .rtf and MS Word Document files. Your file must be smaller than 2MB. [Contact the GOV.UK Notify team](https://www.notifications.service.gov.uk/support/ask-question-give-feedback) if you need to send other file types.

Pass the file object as a value into the `personalisation` argument. For example:

```javascript
var fs = require('fs')

fs.readFile('path/to/document.pdf', function (err, pdfFile) {
  console.log(err)
  notifyClient.sendEmail(templateId, emailAddress, {
    personalisation: {
      first_name: 'Amala',
      application_date: '2018-01-01',
      link_to_file: notifyClient.prepareUpload(pdfFile)
    }
  }).then(response => console.log(response)).catch(err => console.error(err))
})
```

The method returns a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) [external link]. The promise will either:

- resolve with a `response` if successful
- fail with an `err` if unsuccessful

##### CSV Files

Uploads for CSV files should use the `isCsv` parameter on the `prepareUpload()` function.  For example:

```javascript
var fs = require('fs')

fs.readFile('path/to/document.csv', function (err, csvFile) {
  console.log(err)
  notifyClient.sendEmail(templateId, emailAddress, {
    personalisation: {
      first_name: 'Amala',
      application_date: '2018-01-01',
      link_to_file: notifyClient.prepareUpload(csvFile, true)
    }
  }).then(response => console.log(response)).catch(err => console.error(err))
})
```

#### Response

If the request is successful, the promise resolves with a `response` `object`. For example, the `response.data` property will look like this:

```javascript
{
  'id': '740e5834-3a29-46b4-9a6f-16142fde533a',
  'reference': 'your_reference_here',
  'content': {
    'subject': 'SUBJECT TEXT',
    'body': 'MESSAGE TEXT',
    'from_email': 'SENDER EMAIL'
  },
  'uri': 'https://api.notifications.service.gov.uk/v2/notifications/740e5834-3a29-46b4-9a6f-16142fde533a',
  'template': {
    'id': 'f33517ff-2a88-4f6e-b855-c550268ce08a',
    'version': INTEGER,
    'uri': 'https://api.notifications.service.gov.uk/v2/template/f33517ff-2a88-4f6e-b855-c550268ce08a'
  }
}
```

#### Error codes

If the request is not successful, the promise fails with an `err`.

|err.response.data.status_code|err.response.data.errors|How to fix|
|:---|:---|:---|
|`400`|`[{`<br>`"error": "BadRequestError",`<br>`"message": "Can't send to this recipient using a team-only API key"`<br>`}]`|Use the correct type of [API key](#api-keys)|
|`400`|`[{`<br>`"error": "BadRequestError",`<br>`"message": "Can't send to this recipient when service is in trial mode - see https://www.notifications.service.gov.uk/trial-mode"`<br>`}]`|Your service cannot send this notification in [trial mode](https://www.notifications.service.gov.uk/features/using-notify#trial-mode)|
|`400`|`[{`<br>`"error": "BadRequestError",`<br>`"message": "Unsupported file type '(FILE TYPE)'. Supported types are: '(ALLOWED TYPES)'"`<br>`}]`|Wrong file type. You can only upload .pdf, .csv, .txt, .doc, .docx, .rtf or .odt files|
|`400`|`[{`<br>`"error": "BadRequestError",`<br>`"message": "File did not pass the virus scan"`<br>`}]`|The file contains a virus|
|`400`|`[{`<br>`"error": "BadRequestError",`<br>`"message": "Send files by email has not been set up - add contact details for your service at https://www.notifications.service.gov.uk/services/(SERVICE ID)/service-settings/send-files-by-email"`<br>`}]`|See how to [add contact details to the file download page](#add-contact-details-to-the-file-download-page)|
|`403`|`[{`<br>`"error": "AuthError",`<br>`"message": "Error: Your system clock must be accurate to within 30 seconds"`<br>`}]`|Check your system clock|
|`403`|`[{`<br>`"error": "AuthError",`<br>`"message": "Invalid token: API key not found"`<br>`}]`|Use the correct API key. Refer to [API keys](#api-keys) for more information|
|`429`|`[{`<br>`"error": "RateLimitError",`<br>`"message": "Exceeded rate limit for key type TEAM/TEST/LIVE of 3000 requests per 60 seconds"`<br>`}]`|Refer to [API rate limits](#rate-limits) for more information|
|`429`|`[{`<br>`"error": "TooManyRequestsError",`<br>`"message": "Exceeded send limits (LIMIT NUMBER) for today"`<br>`}]`|Refer to [service limits](#daily-limits) for the limit number|
|`500`|`[{`<br>`"error": "Exception",`<br>`"message": "Internal server error"`<br>`}]`|Notify was unable to process the request, resend your notification.|
|`N/A`|`File is larger than 2MB`|The file is too big. Files must be smaller than 2MB|

### Send a letter

When you add a new service it will start in [trial mode](https://www.notifications.service.gov.uk/features/trial-mode). You can only send letters when your service is live.

To send Notify a request to go live:

1. [Sign in to GOV.UK Notify](https://www.notifications.service.gov.uk/sign-in).
1. Go to the __Settings__ page.
1. In the __Your service is in trial mode__ section, select __request to go live__.

#### Method

```javascript
notifyClient
  .sendLetter(templateId, {
    personalisation: personalisation,
    reference: reference
  })
  .then(response => console.log(response))
  .catch(err => console.error(err))
```

The method returns a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) [external link]. The promise will either:

- resolve with a `response` if successful
- fail with an `err` if unsuccessful

#### Arguments

##### templateId (required)

To find the template ID:

1. [Sign in to GOV.UK Notify](https://www.notifications.service.gov.uk/sign-in).
1. Go to the __Templates__ page and select the relevant template.
1. Select __Copy template ID to clipboard__.

For example:

```
"f33517ff-2a88-4f6e-b855-c550268ce08a"
```

##### personalisation (required)

The personalisation argument always contains the following parameters for the letter recipient’s address:

- `address_line_1`
- `address_line_2`
- `address_line_3`
- `address_line_4`
- `address_line_5`
- `address_line_6`
- `address_line_7`

The address must have at least 3 lines.

The last line needs to be a real UK postcode or the name of a country outside the UK.

Notify checks for international addresses and will automatically charge you the correct postage.

The `postcode` personalisation argument has been replaced. If your template still uses `postcode`, Notify will treat it as the last line of the address.

Any other placeholder fields included in the letter template also count as required parameters. You must provide their values in an `object`. For example:

```javascript
{
  personalisation: {
    'address_line_1': 'The Occupier',
    'address_line_2': '123 High Street',
    'address_line_3': 'SW14 6BH',
    'application_date': '2018-01-01'
  }
}
```

##### reference (optional)

A unique identifier you can create if required. This reference identifies a single unique notification or a batch of notifications. It must not contain any personal information such as name or postal address. For example:

```
"your_reference_here"
```

#### Response

If the request is successful, the promise resolves with a `response` `object`. For example, the `response.data` property will look like this:

```javascript
{
  'id': '740e5834-3a29-46b4-9a6f-16142fde533a',
  'reference': null,
  'content': {
    'subject': 'Licence renewal',
    'body': 'Dear Bill, your licence is due for renewal on 3 January 2016.'
  },
  'uri': 'https://api.notifications.service.gov.uk/v2/notifications/740e5834-3a29-46b4-9a6f-16142fde533a',
  'template': {
    'id': 'f33517ff-2a88-4f6e-b855-c550268ce08a',
    'version': 1,
    'uri': 'https://api.notifications.service.gov.uk/v2/template/f33517ff-2a88-4f6e-b855-c550268ce08a'
  },
  'scheduled_for': null
}
```

#### Error codes

If the request is not successful, the promise fails with an `err`.

|err.response.data.status_code|err.response.data.errors|How to fix|
|:--- |:---|:---|
|`400`|`[{`<br>`"error": "BadRequestError",`<br>`"message": "Cannot send letters with a team api key"`<br>`}]`|Use the correct type of [API key](#api-keys).|
|`400`|`[{`<br>`"error": "BadRequestError",`<br>`"message": "Cannot send letters when service is in trial mode - see https://www.notifications.service.gov.uk/trial-mode"`<br>`}]`|Your service cannot send this notification in [trial mode](https://www.notifications.service.gov.uk/features/using-notify#trial-mode).|
|`400`|`[{`<br>`"error": "ValidationError",`<br>`"message": "personalisation address_line_1 is a required property"`<br>`}]`|Ensure that your template has a field for the first line of the address, refer to [personalisation](#send-a-letter-arguments-personalisation-required) for more information.|
|`400`|`[{`<br>`"error": "ValidationError",`<br>`"message": "Must be a real UK postcode"`<br>`}]`|Ensure that the value for the last line of the address is a real UK postcode.|
|`400`|`[{`<br>`"error": "ValidationError",`<br>`"message": "Last line of address must be a real UK postcode or another country"`<br>`}]`|Ensure that the value for the last line of the address is a real UK postcode or the name of a country outside the UK.|
|`403`|`[{`<br>`"error": "AuthError",`<br>`"message": "Error: Your system clock must be accurate to within 30 seconds"`<br>`}]`|Check your system clock.|
|`403`|`[{`<br>`"error": "AuthError",`<br>`"message": "Invalid token: API key not found"`<br>`}]`|Use the correct API key. Refer to [API keys](#api-keys) for more information.|
|`429`|`[{`<br>`"error": "RateLimitError",`<br>`"message": "Exceeded rate limit for key type TEAM/TEST/LIVE of 3000 requests per 60 seconds"`<br>`}]`|Refer to [API rate limits](#rate-limits) for more information.|
|`429`|`[{`<br>`"error": "TooManyRequestsError",`<br>`"message": "Exceeded send limits (LIMIT NUMBER) for today"`<br>`}]`|Refer to [service limits](#daily-limits) for the limit number.|
|`500`|`[{`<br>`"error": "Exception",`<br>`"message": "Internal server error"`<br>`}]`|Notify was unable to process the request, resend your notification.|


### Send a precompiled letter

#### Method

```javascript
var response = notifyClient.sendPrecompiledLetter(
  reference,
  pdfFile,
  postage
)
```

#### Arguments

##### reference (required)

A unique identifier you create. This reference identifies a single unique notification or a batch of notifications. It must not contain any personal information such as name or postal address. For example:

```
"your_reference_here"
```

##### pdfFile

The precompiled letter must be a PDF file which meets [the GOV.UK Notify letter specification](https://www.notifications.service.gov.uk/using-notify/guidance/letter-specification). For example:

```javascript
var fs = require('fs')

fs.readFile('path/to/document.pdf', function (err, pdfFile) {
  if (err) {
    console.error(err)
  }
  var notification = notifyClient.sendPrecompiledLetter(
    'your reference', pdfFile
  )
})
```

##### postage (optional)

You can choose first or second class postage for your precompiled letter. Set the value to `first` for first class, or `second` for second class. If you do not pass in this argument, the postage will default to second class.


#### Response

If the request is successful, the promise resolves with a `response` `object`. For example, the `response.data` property will look like this:

```javascript
{
  'id': '740e5834-3a29-46b4-9a6f-16142fde533a',
  'reference': 'your-letter-reference',
  'postage': 'second'
}
```

#### Error codes

If the request is not successful, the promise fails with an `err`.

|err.response.data.status_code|err.response.data.errors|How to fix|
|:--- |:---|:---|
|`400`|`[{`<br>`"error": "BadRequestError",`<br>`"message": "Cannot send letters with a team api key"`<br>`}]`|Use the correct type of [API key](#api-keys)|
|`400`|`[{`<br>`"error": "BadRequestError",`<br>`"message": "Cannot send letters when service is in trial mode - see https://www.notifications.service.gov.uk/trial-mode"`<br>`}]`|Your service cannot send this notification in [trial mode](https://www.notifications.service.gov.uk/features/using-notify#trial-mode)|
|`400`|`[{`<br>`"error": "ValidationError",`<br>`"message": "personalisation address_line_1 is a required property"`<br>`}]`|Send a valid PDF file|
|`400`|`[{`<br>`"error": "ValidationError",`<br>`"message": "postage invalid. It must be either first or second."`<br>`}]`|Change the value of `postage` argument in the method call to either 'first' or 'second'|
|`403`|`[{`<br>`"error": "AuthError",`<br>`"message": "Error: Your system clock must be accurate to within 30 seconds"`<br>`}]`|Check your system clock|
|`403`|`[{`<br>`"error": "AuthError",`<br>`"message": "Invalid token: API key not found"`<br>`}]`|Use the correct API key. Refer to [API keys](#api-keys) for more information|
|`429`|`[{`<br>`"error": "RateLimitError",`<br>`"message": "Exceeded rate limit for key type TEAM/TEST/LIVE of 3000 requests per 60 seconds"`<br>`}]`|Refer to [API rate limits](#rate-limits) for more information|
|`429`|`[{`<br>`"error": "TooManyRequestsError",`<br>`"message": "Exceeded send limits (LIMIT NUMBER) for today"`<br>`}]`|Refer to [service limits](#daily-limits) for the limit number|
|N/A|`"message":"precompiledPDF must be a valid PDF file"`|Send a valid PDF file|
|N/A|`"message":"reference cannot be null or empty"`|Populate the reference parameter|
|N/A|`"message":"precompiledPDF cannot be null or empty"`|Send a PDF file with data in it|

## Get message status

Message status depends on the type of message you have sent.

You can only get the status of messages that are 7 days old or newer.

### Status - email

|Status|Information|
|:---|:---|
|Created|GOV.UK Notify has placed the message in a queue, ready to be sent to the provider. It should only remain in this state for a few seconds.|
|Sending|GOV.UK Notify has sent the message to the provider. The provider will try to deliver the message to the recipient for up to 72 hours. GOV.UK Notify is waiting for delivery information.|
|Delivered|The message was successfully delivered.|
|Failed|This covers all failure statuses:<br>- `permanent-failure` - "The provider could not deliver the message because the email address was wrong. You should remove these email addresses from your database."<br>- `temporary-failure` - "The provider could not deliver the message. This can happen when the recipient’s inbox is full. You can try to send the message again."<br>- `technical-failure` - "Your message was not sent because there was a problem between Notify and the provider.<br>You’ll have to try sending your messages again."|

### Status - text message

|Status|Information|
|:---|:---|
|Created|GOV.UK Notify has placed the message in a queue, ready to be sent to the provider. It should only remain in this state for a few seconds.|
|Sending|GOV.UK Notify has sent the message to the provider. The provider will try to deliver the message to the recipient for up to 72 hours. GOV.UK Notify is waiting for delivery information.|
|Pending|GOV.UK Notify is waiting for more delivery information.<br>GOV.UK Notify received a callback from the provider but the recipient’s device has not yet responded. Another callback from the provider determines the final status of the notification.|
|Sent / Sent internationally|The message was sent to an international number. The mobile networks in some countries do not provide any more delivery information. The GOV.UK Notify client API returns this status as `sent`. The GOV.UK Notify client app returns this status as `Sent to an international number`.|
|Delivered|The message was successfully delivered.|
|Failed|This covers all failure statuses:<br>- `permanent-failure` - "The provider could not deliver the message. This can happen if the phone number was wrong or if the network operator rejects the message. If you’re sure that these phone numbers are correct, you should [contact GOV.UK Notify support](https://www.notifications.service.gov.uk/support). If not, you should remove them from your database. You’ll still be charged for text messages that cannot be delivered."<br>- `temporary-failure` - "The provider could not deliver the message. This can happen when the recipient’s phone is off, has no signal, or their text message inbox is full. You can try to send the message again. You’ll still be charged for text messages to phones that are not accepting messages."<br>- `technical-failure` - "Your message was not sent because there was a problem between Notify and the provider.<br>You’ll have to try sending your messages again. You will not be charged for text messages that are affected by a technical failure."|

### Status - letter

|Status|information|
|:---|:---|
|Failed|The only failure status that applies to letters is `technical-failure`. GOV.UK Notify had an unexpected error while sending to our printing provider.|
|Accepted|GOV.UK Notify has sent the letter to the provider to be printed.|
|Received|The provider has printed and dispatched the letter.|

### Status - precompiled letter

|Status|information|
|:---|:---|
|Pending virus check|GOV.UK Notify has not completed a virus scan of the precompiled letter file.|
|Virus scan failed|GOV.UK Notify found a potential virus in the precompiled letter file.|
|Validation failed|Content in the precompiled letter file is outside the printable area. [See the GOV.UK Notify letter specification](https://www.notifications.service.gov.uk/using-notify/guidance/letter-specification) for more information. |

### Get the status of one message

#### Method

```javascript
notifyClient
  .getNotificationById(notificationId)
  .then((response) => console.log(response))
  .catch((err) => console.error(err))
```

The method returns a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) [external link]. The promise will either:

- resolve with a `response` if successful
- fail with an `err` if unsuccessful

#### Arguments

##### notificationId (required)

The ID of the notification. To find the notification ID, you can either:

* check the response to the [original notification method call](#response)
* [sign in to GOV.UK Notify](https://www.notifications.service.gov.uk/sign-in) and go to the __API integration__ page

#### Response

If the request is successful, the promise resolves with a `response` `object`. For example, the `response.data` property will look like this:

```javascript
{
  'id': 'notify_id',
  'body': 'Hello Foo',
  'subject': 'null|email_subject',
  'reference': 'client reference',
  'email_address': 'email address',
  'phone_number': 'phone number',
  'line_1': 'full name of a person or company',
  'line_2': '123 The Street',
  'line_3': 'Some Area',
  'line_4': 'Some Town',
  'line_5': 'Some county',
  'line_6': 'Something else',
  'line_7': 'UK postcode or country',
  'postage': 'first or second',
  'type': 'sms|letter|email',
  'status': 'current status',
  'template': {
    'version': 1,
    'id': 1,
    'uri': '/template/{id}/{version}'
  },
  'created_by_name': 'name of the person who sent the notification if sent manually',
  'created_at': 'created at',
  'sent_at': 'sent to provider at'
}
```

#### Error codes

If the request is not successful, the promise fails with an `err`.

|err.response.data.status_code|err.response.data.errors|How to fix|
|:---|:---|:---|
|`400`|`[{`<br>`"error": "ValidationError",`<br>`"message": "id is not a valid UUID"`<br>`}]`|Check the notification ID|
|`403`|`[{`<br>`"error": "AuthError",`<br>`"message": "Error: Your system clock must be accurate to within 30 seconds"`<br>`}]`|Check your system clock|
|`403`|`[{`<br>`"error": "AuthError",`<br>`"message": "Invalid token: API key not found"`<br>`}]`|Use the correct API key. Refer to [API keys](#api-keys) for more information|
|`404`|`[{`<br>`"error": "NoResultFound",`<br>`"message": "No result found"`<br>`}]`|Check the notification ID|


### Get the status of multiple messages

This API call returns one page of up to 250 messages and statuses. You can get either the most recent messages, or get older messages by specifying a particular notification ID in the [`olderThan`](#olderthan-optional) argument.

You can only get the status of messages that are 7 days old or newer.

#### Method

```javascript
notifyClient
  .getNotifications(templateType, status, reference, olderThan)
  .then((response) => console.log(response))
  .catch((err) => console.error(err))
```

The method returns a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) [external link]. The promise will either:

- resolve with a `response` if successful
- fail with an `err` if unsuccessful

To get the most recent messages, you must pass in an empty `olderThan` argument or `null`.

To get older messages, pass the ID of an older notification into the `olderThan` argument. This returns the next oldest messages from the specified notification ID.

#### Arguments

You can pass in empty arguments or `null` to ignore these filters.

##### status (optional)

You can filter by each:

* [email status](#status-email)
* [text message status](#status-text-message)
* [letter status](#status-letter)
* [precompiled letter status](#status-precompiled-letter)

You can leave out this argument to ignore this filter.

##### notificationType (optional)

You can filter by:

* `email`
* `sms`
* `letter`

##### reference (optional)

A unique identifier you create if necessary. This reference identifies a single unique notification or a batch of notifications. It must not contain any personal information such as name or postal address. For example:

```
"your_reference_here"
```

##### olderThan (optional)

Input the ID of a notification into this argument. If you use this argument, the client returns the next 250 received notifications older than the given ID. For example:

```
"8e222534-7f05-4972-86e3-17c5d9f894e2"
```

If you pass in an empty argument or `null`, the client returns the most recent 250 notifications.

#### Response

If the request is successful, the promise resolves with a `response` `object`. For example, the `response.data` property will look like this:

```javascript
{
  'notifications': [
    {
      'id': 'notify_id',
      'reference': 'client reference',
      'email_address': 'email address',
      'phone_number': 'phone number',
      'line_1': 'full name of a person or company',
      'line_2': '123 The Street',
      'line_3': 'Some Area',
      'line_4': 'Some Town',
      'line_5': 'Some county',
      'line_6': 'Something else',
      'postcode': 'postcode',
      'postage': 'first or second',
      'type': 'sms | letter | email',
      'status': 'sending | delivered | permanent-failure | temporary-failure | technical-failure',
      'template': {
        'version': 1,
        'id': 1,
        'uri': '/template/{id}/{version}'
      },
      'created_by_name': 'name of the person who sent the notification if sent manually',
      'created_at': 'created at',
      'sent_at': 'sent to provider at'
    }
    // …
  ],
  'links': {
    'current': '/notifications?template_type=sms&status=delivered',
    'next': '/notifications?other_than=last_id_in_list&template_type=sms&status=delivered'
  }
}
```

#### Error codes

If the request is not successful, the promise fails with an `err`.

|err.response.data.status_code|err.response.data.errors|How to fix|
|:---|:---|:---|
|`400`|`[{`<br>`"error": "ValidationError",`<br>`"message": "bad status is not one of [created, sending, sent, delivered, pending, failed, technical-failure, temporary-failure, permanent-failure, accepted, received]"`<br>`}]`|Contact the GOV.UK Notify team|
|`400`|`[{`<br>`"error": "ValidationError",`<br>`"message": "Applet is not one of [sms, email, letter]"`<br>`}]`|Contact the GOV.UK Notify team|
|`403`|`[{`<br>`"error": "AuthError",`<br>`"message": "Error: Your system clock must be accurate to within 30 seconds"`<br>`}]`|Check your system clock|
|`403`|`[{`<br>`"error": "AuthError",`<br>`"message": "Invalid token: API key not found"`<br>`}]`|Use the correct API key. Refer to [API keys](#api-keys) for more information|


### Get a PDF for a letter notification

#### Method

```javascript
notifyClient
  .getPdfForLetterNotification(notificationId)
  .then(function (fileBuffer) {
    return fileBuffer
  }) /* the response is a file buffer, an instance of Buffer */
  .catch((err) => console.error(err))
```

The method returns a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) [external link]. The promise will either:

- resolve with `fileBuffer` if successful
- fail with an `err` if unsuccessful

#### Arguments

##### notificationId (required)

The ID of the notification. To find the notification ID, you can either:

* check the response to the [original notification method call](#get-the-status-of-one-message-response)
* [sign in to GOV.UK Notify](https://www.notifications.service.gov.uk/sign-in) and go to the __API integration__ page

#### Response

If the request to the client is successful, the client will return an instance of the [Buffer](https://nodejs.org/api/buffer.html#buffer_buffer) class containing the raw PDF data.

#### Error codes

If the request is not successful, the client will return an `HTTPError` containing the relevant error code:

|error.status_code|error.message|How to fix|
|:---|:---|:---|
|`400`|`[{`<br>`"error": "ValidationError",`<br>`"message": "id is not a valid UUID"`<br>`}]`|Check the notification ID|
|`400`|`[{`<br>`"error": "PDFNotReadyError",`<br>`"message": "PDF not available yet, try again later"`<br>`}]`|Wait for the notification to finish processing. This usually takes a few seconds|
|`400`|`[{`<br>`"error": "BadRequestError",`<br>`"message": "File did not pass the virus scan"`<br>`}]`|You cannot retrieve the contents of a letter notification that contains a virus|
|`400`|`[{`<br>`"error": "BadRequestError",`<br>`"message": "PDF not available for letters in technical-failure"`<br>`}]`|You cannot retrieve the contents of a letter notification in technical-failure|
|`400`|`[{`<br>`"error": "ValidationError",`<br>`"message": "Notification is not a letter"`<br>`}]`|Check that you are looking up the correct notification|
|`403`|`[{`<br>`"error": "AuthError",`<br>`"message": "Error: Your system clock must be accurate to within 30 seconds"`<br>`}]`|Check your system clock|
|`403`|`[{`<br>`"error": "AuthError",`<br>`"message": "Invalid token: API key not found"`<br>`}]`|Use the correct API key. Refer to [API keys](#api-keys) for more information|
|`404`|`[{`<br>`"error": "NoResultFound",`<br>`"message": "No result found"`<br>`}]`|Check the notification ID|


## Get a template

### Get a template by ID

#### Method

This returns the latest version of the template.

```javascript
notifyClient
  .getTemplateById(templateId)
  .then((response) => console.log(response))
  .catch((err) => console.error(err))
```

The method returns a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) [external link]. The promise will either:

- resolve with a `response` if successful
- fail with an `err` if unsuccessful

#### Arguments

##### templateId (required)

The ID of the template. [Sign in to GOV.UK Notify](https://www.notifications.service.gov.uk/sign-in) and go to the __Templates__ page to find it. For example:

```
"f33517ff-2a88-4f6e-b855-c550268ce08a"
```

#### Response

If the request is successful, the promise resolves with a `response` `object`. For example, the `response.data` property will look like this:

```javascript
{
  'id': 'template_id',
  'name': 'template name',
  'type': 'sms|email|letter',
  'created_at': 'created at',
  'updated_at': 'updated at',
  'version': 'version',
  'created_by': 'someone@example.com',
  'body': 'body',
  'subject': 'null|email_subject',
  'letter_contact_block': 'null|letter_contact_block'
}
```

#### Error codes

If the request is not successful, the promise fails with an `err`.

|err.response.data.status_code|err.response.data.errors|How to fix|
|:---|:---|:---|
|`403`|`[{`<br>`"error": "AuthError",`<br>`"message": "Error: Your system clock must be accurate to within 30 seconds"`<br>`}]`|Check your system clock|
|`403`|`[{`<br>`"error": "AuthError",`<br>`"message": "Invalid token: API key not found"`<br>`}]`|Use the correct API key. Refer to [API keys](#api-keys) for more information|
|`404`|`[{`<br>`"error": "NoResultFound",`<br>`"message": "No Result Found"`<br>`}]`|Check your [template ID](#get-a-template-by-id-arguments-templateid-required)|


### Get a template by ID and version

#### Method

```javascript
notifyClient
  .getTemplateByIdAndVersion(templateId, version)
  .then((response) => console.log(response))
  .catch((err) => console.error(err))
```

The method returns a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) [external link]. The promise will either:

- resolve with a `response` if successful
- fail with an `err` if unsuccessful

#### Arguments

##### templateId (required)

The ID of the template. [Sign in to GOV.UK Notify](https://www.notifications.service.gov.uk/sign-in) and go to the __Templates__ page to find it. For example:

```
"f33517ff-2a88-4f6e-b855-c550268ce08a"
```

##### version (required)

The version number of the template.

#### Response

If the request is successful, the promise resolves with a `response` `object`. For example, the `response.data` property will look like this:

```javascript
{
  'id': 'template_id',
  'name': 'template name',
  'type': 'sms|email|letter',
  'created_at': 'created at',
  'updated_at': 'updated at',
  'version': 'version',
  'created_by': 'someone@example.com',
  'body': 'body',
  'subject': 'null|email_subject',
  'letter_contact_block': 'null|letter_contact_block'
}
```

#### Error codes

If the request is not successful, the promise fails with an `err`.

|err.response.data.status_code|err.response.data.errors|How to fix|
|:---|:---|:---|
|`400`|`[{`<br>`"error": "ValidationError",`<br>`"message": "id is not a valid UUID"`<br>`}]`|Check the notification ID|
|`403`|`[{`<br>`"error": "AuthError",`<br>`"message": "Error: Your system clock must be accurate to within 30 seconds"`<br>`}]`|Check your system clock|
|`403`|`[{`<br>`"error": "AuthError",`<br>`"message": "Invalid token: API key not found"`<br>`}]`|Use the correct API key. Refer to [API keys](#api-keys) for more information|
|`404`|`[{`<br>`"error": "NoResultFound",`<br>`"message": "No Result Found"`<br>`}]`|Check your [template ID](#get-a-template-by-id-and-version-arguments-templateid-required) and [version](#version-required)|


### Get all templates

#### Method

This returns the latest version of all templates.

```javascript
notifyClient
  .getAllTemplates(templateType)
  .then((response) => console.log(response))
  .catch((err) => console.error(err))
```

The method returns a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) [external link]. The promise will either:

- resolve with a `response` if successful
- fail with an `err` if unsuccessful

#### Arguments

##### templateType (optional)

If you do not use `templateType`, the client returns all templates. Otherwise you can filter by:

- `email`
- `sms`
- `letter`

#### Response

If the request is successful, the promise resolves with a `response` `object`. For example, the `response.data` property will look like this:

```javascript
{
  'templates': [
    {
      'id': 'template_id',
      'name': 'template name',
      'type': 'sms|email|letter',
      'created_at': 'created at',
      'updated_at': 'updated at',
      'version': 'version',
      'created_by': 'someone@example.com',
      'body': 'body',
      'subject': 'null|email_subject',
      'letter_contact_block': 'null|letter_contact_block'
    },
    {
      // … another template
    }
  ]
}
```

If no templates exist for a template type or there no templates for a service, the object is empty.

### Generate a preview template

#### Method

This generates a preview version of a template.

```javascript
personalisation = { 'foo': 'bar' }
notifyClient
  .previewTemplateById(templateId, personalisation)
  .then((response) => console.log(response))
  .catch((err) => console.error(err))
```

The method returns a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) [external link]. The promise will either:

- resolve with a `response` if successful
- fail with an `err` if unsuccessful

The parameters in the personalisation argument must match the placeholder fields in the actual template. The API notification client ignores any extra fields in the method.

#### Arguments

##### templateId (required)

The ID of the template. [Sign in to GOV.UK Notify](https://www.notifications.service.gov.uk/sign-in) and go to the __Templates__ page to find it. For example:

```
"f33517ff-2a88-4f6e-b855-c550268ce08a"
```

##### personalisation (optional)

If a template has placeholder fields for personalised information such as name or application date, you must provide their values in an `object`. For example:

```javascript
{
  personalisation: {
    'first_name': 'Amala',
    'reference_number': '300241'
  }
}
```

You can leave out this argument if a template does not have any placeholder fields for personalised information.

#### Response

If the request is successful, the promise resolves with a `response` `object`. For example, the `response.data` property will look like this:

```javascript
{
  'id': 'notify_id',
  'type': 'sms|email|letter',
  'version': 'version',
  'body': 'Hello bar', // with substitution values
  'subject': 'null|email_subject',
  'html': '<p>Example</p>' // Returns the rendered body (email templates only)
}
```

#### Error codes

If the request is not successful, the promise fails with an `err`.

|err.response.data.status_code|err.response.data.errors|How to fix|
|:---|:---|:---|
|`400`|`[{`<br>`"error": "BadRequestError",`<br>`"message": "Missing personalisation: [PERSONALISATION FIELD]"`<br>`}]`|Check that the personalisation arguments in the method match the placeholder fields in the template|
|`400`|`[{`<br>`"error": "NoResultFound",`<br>`"message": "No result found"`<br>`}]`|Check the [template ID](#generate-a-preview-template-arguments-templateid-required)|
|`403`|`[{`<br>`"error": "AuthError",`<br>`"message": "Error: Your system clock must be accurate to within 30 seconds"`<br>`}]`|Check your system clock|
|`403`|`[{`<br>`"error": "AuthError",`<br>`"message": "Invalid token: API key not found"`<br>`}]`|Use the correct API key. Refer to [API keys](#api-keys) for more information|


## Get received text messages

This API call returns one page of up to 250 received text messages. You can get either the most recent messages, or get older messages by specifying a particular notification ID in the [`olderThan`](#get-a-page-of-received-text-messages-arguments-olderthan-optional) argument.

You can only get messages that are 7 days old or newer.

You can also set up [callbacks](#callbacks) for received text messages.

### Enable received text messages

Contact the GOV.UK Notify team using the [support page](https://www.notifications.service.gov.uk/support) or [chat to us on Slack](https://ukgovernmentdigital.slack.com/messages/C0E1ADVPC) to request a unique number for text message replies.

### Get a page of received text messages

#### Method

```javascript
notifyClient
  .getReceivedTexts(olderThan)
  .then((response) => console.log(response))
  .catch((err) => console.error(err))
```

The method returns a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) [external link]. The promise will either:

- resolve with a `response` if successful
- fail with an `err` if unsuccessful

To get the most recent messages, you must pass in an empty argument or `null`.

To get older messages, pass the ID of an older notification into the `olderThan` argument. This returns the next oldest messages from the specified notification ID.

#### Arguments

##### olderThan (optional)

Input the ID of a received text message into this argument. If you use this argument, the client returns the next 250 received text messages older than the given ID. For example:

```
8e222534-7f05-4972-86e3-17c5d9f894e2"
```

If you pass in an empty argument or `null`, the client returns the most recent 250 text messages.

#### Response

If the request to the client is successful, the promise resolves with an `object` containing all received texts.

```javascript
{
  'received_text_messages':
        [
          {
            'id': 'notify_id', // required
            'user_number': 'user number', // required user number
            'notify_number': 'notify number', // receiving number
            'created_at': 'created at', // required
            'service_id': 'service id', // required service id
            'content': 'text content' // required text content
          }
          // …
        ],
  'links': {
    'current': '/received-test-messages',
    'next': '/received-text-messages?older_than=last_id_in_list'
  }
}
```

If the notification specified in the `olderThan` argument is older than 7 days, the promise resolves an empty response.

#### Error codes

If the request is not successful, the promise fails with an `err`.

|err.response.data.status_code|err.response.data.errors|How to fix|
|:---|:---|:---|
|`403`|`[{`<br>`"error": "AuthError",`<br>`"message": "Error: Your system clock must be accurate to within 30 seconds"`<br>`}]`|Check your system clock|
|`403`|`[{`<br>`"error": "AuthError",`<br>`"message": "Invalid token: API key not found"`<br>`}]`|Use the correct API key. Refer to [API keys](#api-keys) for more information|
