/**
 * constants
 */

APP_NAME                                = "SHINE";

DEFAULT_LIST_INCREMENT                  = 10;

NOTIFICATION_MSG_TYPE_COMMENT           = 'comment';
NOTIFICATION_MSG_TYPE_NOTICE            = 'notice';

ERROR_CODE_SECURITY                     = 403;
ERROR_CODE_MATCH                        = 501;
ERROR_CODE_DATABASE                     = 531;

System = {

  // URLs used in mail template
  url: {
    mailLogo: Meteor.absoluteUrl("http://file.bookpal.co.kr/novel/images/head/logo4y_2.png"),
    facebook: "https://www.facebook.com/bookpal.co.kr",
    twitter: "https://twitter.com/bookpalkorea",
    termsOfUse: Meteor.absoluteUrl("terms-of-use"),
    privacyPolicy: Meteor.absoluteUrl("privacy-policy"),
    unsubscribe: Meteor.absoluteUrl("unsubscribe")
  }
};
