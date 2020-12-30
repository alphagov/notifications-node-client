## 5.1.0 - 2020-12-30

### Changed

* Upgrade axios version from 0.19.2 to 0.21.1
* Allow any compatible version of axios to be used (0.21.1 to <1.0.0)
* Allow any compatible version of jsonwebtoken to be used (8.2.1 to <9.0.0)

## 5.0.2 - 2020-11-20

### Changed

Correct incorrect description of parameter to be used by `NotifyClient.setProxy`

## 5.0.1 - 2020-11-18

### Changed

Remove unintentional global nature of variable `version`

## 5.0.0 - 2020-09-02

### Changed

We have replaced the use of the npm [request-promise](https://www.npmjs.com/package/request-promise) package with [axios](https://www.npmjs.com/package/axios) as the npm [request](https://www.npmjs.com/package/request) package has been deprecated. This makes the following breaking changes:

1. The `response` `object` returned by a successful API call is now in the form of an [axios response](https://www.npmjs.com/package/axios#response-schema). This has a different interface to a [request response](https://nodejs.org/api/http.html#http_class_http_incomingmessage). For example:

    * `response.body` becomes `response.data`
    * `response.statusCode` becomes `response.status`

2. The `err` `object` returned by an unsuccessful API call has a different interface. For example, `err.error` becomes `err.response.data`. See the axios documentation for further details on [error handling](https://www.npmjs.com/package/axios#handling-errors).

3. To configure the use of a proxy you should pass the proxy configuration as an `object` rather than a URL. For details, see the [axios client](https://github.com/axios/axios).

4. We now return native [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) rather than [bluebird promises](http://bluebirdjs.com). You will not need to make any changes unless you are using some of the additional methods found on bluebird promises that do not exist on native promises.


## 4.9.0 - 2020-08-19

### Changed

* Added `letter_contact_block` to the responses for `getTemplateById`, `getTemplateByIdAndVersion` and `getAllTemplates`.

## 4.8.0 - 2020-06-18

### Changed

* Add support for an optional `isCsv` parameter in the `prepareUpload` function. This fixes a bug when sending a CSV file by email. This ensures that the file is downloaded as a CSV rather than a TXT file.

## [4.7.3] - 2020-04-03

### Changed

* Remove `__dirname` global call from api client

## [4.7.2] - 2020-01-31

### Changed

* Add homepage to package.json

## [4.7.1] - 2020-01-27

### Changed

* Refer to files, not documents, in error messages

## [4.7.0] - 2019-11-01

### Changed

* Add `notifyClient.getPdfForLetterNotification(notificationId)`
    * Returns a Buffer with pdf data
    * Will raise a BadRequestError if the PDF is not available

## [4.6.0] - 2019-02-01

### Changed

* Added an optional postage argument to `sendPrecompiledLetter`

## [4.5.2] - 2018-11-05

### Changed

* Moved documentation to https://docs.notifications.service.gov.uk/node.html (generated from DOCUMENTATION.md)

## [4.5.1] - 2018-09-14

### Changed

* Made formatting consistent across documentation.

## [4.5.0] - 2018-09-13

### Changed

* Added a function to send precompiled letter through the client.
    * the new function uses a helper function to check if the file size is within the 5MB limit and to encode the file using base64. Then a POST request to our API is made with the file data and user reference.
    * instructions for the new functionality added to the documentation.

## [4.4.0] - 2018-09-05

### Changed

* Added instructions for uploading a document to be linked to from an email notification.
    * Created a helper function `prepareUpload` as a part of this development. This function encodes the document that is to be uploaded with base64 and returns a dictionary with prepared document as a value (the way our API is prepared to receive it). It also checks if the provided file is not larger than 2MB. The function throws an error if the file is too big.

## [4.3.0] - 2018-09-04

* Added `name` to the response for `getTemplateById()` and `getTemplateByIdAndVersion()`
    * These functions now return the name of the template as set in Notify

## [4.2.0] - 2018-07-24

### Changed

* Added `created_by_name` to the response for `.getNotificationById()` and `.getNotifications()`:
    * If the notification was sent manually this will be the name of the sender. If the notification was sent through the API this will be `null`.

## [4.1.0] - 2017-11-23

### Changed

* Added new method:
    * `getReceivedTexts` - get one page of text messages (250) per call

## [4.0.0] - 2017-11-07

### Changed

* Updated `sendSms`, `sendEmail` and `sendLetter` to take an `options` object as a parameter.
    * `personalisation`, `reference`, `smsSenderId` and `emailReplyToId` now need to be passed to these functions inside `options`.
* Removed the unused `Crypto` dependency

## [3.5.0] - 2017-11-01

### Changed

* Updated `sendSms` method with optional argument:
    * `smsSenderId` - specify the identifier of the sms sender (optional)

## [3.4.0] - 2017-10-19

### Changed

* Added new method:
    * `sendLetter` - send a letter

## [3.3.0] - 2017-10-13

### Changed

* Updated `sendEmail` method with optional argument:
    * `emailReplyToId` - specify the identifier of the email reply-to address (optional)

## [3.2.0] - 2017-09-22

### Changed

* Added new method:
    * `setProxy(proxyUrl)` - specify the URL of a proxy for the client to use (optional)

## [3.1.0] - 2017-05-10

### Changed

* Added new methods for managing templates:
    * `getTemplateById` - retrieve a single template
    * `getTemplateByIdAndVersion` - retrieve a specific version for a desired template
    * `getAllTemplates` - retrieve all templates (can filter by type)
    * `previewTemplateById` - preview a template with personalisation applied

* Update README to describe how to catch errors

## [3.0.0] - 2016-12-16

### Changed

* Using v2 of the notification-api.

* Update to `notifyClient.sendSms()`:
    * Added `reference`: an optional identifier you generate if you don’t want to use Notify’s `id`. It can be used to identify a single notification or a batch of notifications.
    * Updated method signature:

 ```javascript
 notifyClient.sendSms(templateId, phoneNumber, personalisation, reference);
```
     * Where `personalisation` and `reference` can be `undefined`.

* Update to `notifyClient.sendEmail()`:
    * Added `reference`: an optional identifier you generate if you don’t want to use Notify’s `id`. It can be used to identify a single notification or a batch of notifications.
    * Updated method signature:

 ```javascript
 notifyClient.sendEmail(templateId, emailAddress, personalisation, reference);
```
     * Where `personalisation` and `reference` can be `undefined`.
* `NotificationClient.getAllNotifications()`
    * Notifications can now be filtered by `reference` and `olderThanId`, see the README for details.
    * Updated method signature:

 ```javascript
 notifyClient.getNotifications(templateType, status, reference, olderThanId);
```
     * Each one of these parameters can be `undefined`

# Prior versions

Changelog not recorded - please see pull requests on github.
