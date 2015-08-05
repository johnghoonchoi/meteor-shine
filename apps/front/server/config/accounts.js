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
 */
ServiceConfiguration.configurations.remove({
  service: "facebook"
});

if (ServiceConfiguration.configurations.find({service: 'facebook'}).count() === 0) {
  ServiceConfiguration.configurations.insert({
    service: "facebook",
    appId: Meteor.settings.facebook.appId,
    secret: Meteor.settings.facebook.secret
  });
}


/**
 * Meetup login configuration
 */
ServiceConfiguration.configurations.remove({
  service: "meetup"
});

if (ServiceConfiguration.configurations.find({service: 'meetup'}).count() === 0) {
  ServiceConfiguration.configurations.insert({
    service: 'meetup',
    clientId: Meteor.settings.meetup.clientId,
    secret: Meteor.settings.meetup.secret
  });
}


/**
 * check the validation of user information
 * initialize user information
 */
Accounts.onCreateUser(function(options, user) {
  console.log('options: ' + JSON.stringify(options, null, 2));
  console.log('user:' + JSON.stringify(user, null, 2));

  if (options.profile)
    user.profile = options.profile;

  //if (user.services.facebook) {
  //  var id= user.services.facebook.id;
  //  var img = 'http://graph.facebook.com/' + id + '/picture?type=square&height=160&width=160';
  //  user.profile.url = img;
  //}

  return user;

/*
  var validation = AccountValidator.validateInsert(options);

  if (! _.isEmpty(validation.errors())) {
    throw new Meteor.Error(ERROR_CODE_MATCH, 'error_validation');
  }
*/
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


