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
