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
