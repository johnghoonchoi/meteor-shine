/**
 * Accounts configuration
 */

/**
 * accounts-ui package configuration
 */
Accounts.config({
  sendVerificationEmail: true,
  forbidClientAccountCreation: false
});



/**
 * Facebook login configuration
ServiceConfiguration.configurations.remove({
  service: "facebook"
});

ServiceConfiguration.configurations.insert({
  service: "facebook",
  appId: Meteor.settings.facebook.appId,
  secret: Meteor.settings.facebook.secret
});
 */

/**
 * check the validation of user information
 * initialize user information
 */
Accounts.onCreateUser(function(options, user) {
  console.log('onCreateUser:options = ' + JSON.stringify(options));
  console.log('onCreateUser:user = ' + JSON.stringify(user));

  return user;
});



/**
 * validate user login
 *
 */
Accounts.validateLoginAttempt(function(info) {
  /*
  if (info && info.user) {
    if (info.user.profile.state !== USER_STATE_ACTIVE)
      throw new Meteor.Error(ERROR_CODE_SECURITY, I18n.get('error_account_not_active'));
  } else {
    return false;
  }
  */
  return true;
});


