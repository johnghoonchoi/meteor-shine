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
 * First, add the service configuration package :
 * `meteor add service-configuration`
 */

// Function: Create Service Configuration
// Here, we create a function to help us reset and create our third-party login
// configurations to keep our code as DRY as possible.
createServiceConfiguration = function(service, clientId, secret) {
  ServiceConfiguration.configurations.remove({
    service: service
  });

  // Note: here we have to do a bit of light testing on our service argument.
  // Facebook and Twitter use different key names for their OAuth client ID,
  // so we need to update our passed object accordingly before we insert it
  // into our configurations.
  var config = {
    generic: {
      clientId: clientId,
      secret: secret,
      loginStyle: 'redirect'
    },
    facebook: {
      appId: clientId,
      secret: secret,
      loginStyle: 'redirect'
    },
    twitter: {
      consumerKey: clientId,
      secret: secret,
      loginStyle: 'redirect'
      // https://github.com/meteor/meteor/wiki/OAuth-for-mobile-Meteor-clients
      //
      // The "redirect" style can be used in situations where a popup window can't be opened,
      // such as in a mobile UIWebView. The "redirect" style however relies on
      // session storage which isn't available in Safari private mode,
      // so the "popup" style will be forced if session storage can't be used.
      // - Inside UIWebViews (when your app is loaded inside a mobile app)
      // - In Safari on iOS8 (window.close is not supported due to a bug)
    }
  };

  // To simplify this a bit, we make use of a case/switch statement. This is
  // a shorthand way to say "when the service argument is equal to <x> do this."
  switch(service) {
    case 'facebook' :
      ServiceConfiguration.configurations.upsert({ service: service }, { $set: config.facebook });
      break;
    case 'twitter' :
      ServiceConfiguration.configurations.upsert({ service: service }, { $set: config.facebook });
      break;
    default :
      ServiceConfiguration.configurations.upsert({ service: service }, { $set: config.generic });
  }
};

/**
 * Configure Third-Party Login Services
 * Note: We're passing the Service Name, Client Id, and Secret.
 */

// Facebook
// Generate your appId & Secret here: https://developers.facebook.com/apps/
createServiceConfiguration('facebook', Meteor.settings.facebook.appId, Meteor.settings.facebook.secret);

// Google
// Generate your ClientId & Secret here: https://console.developers.google.com
//createServiceConfiguration('google', 'Insert your clientId here.', 'Insert your secret here.');

// Twitter
// Generate your ConsumerKey & Secret here: https://apps.twitter.com/
//createServiceConfiguration('twitter', 'Insert your consumerKey here.', 'Insert your secret here.');

// GitHub
// Generate your ClientId & Secret here: https://github.com/settings/applications
//createServiceConfiguration('github', 'Insert your clientId here.', 'Insert your secret here.');

// Meetup
// Generate your ClientId & Secret here: https://secure.meetup.com/meetup_api/oauth_consumers/
createServiceConfiguration('meetup', Meteor.settings.meetup.clientId, Meteor.settings.meetup.secret);

/**
 * check the validation of user information
 * initialize user information
 */
Accounts.onCreateUser(function(options, user) {
  console.log('options: ' + JSON.stringify(options, null, 2));
  console.log('user:' + JSON.stringify(user, null, 2));
  Logger.info('options: ' + JSON.stringify(options, null, 2));

  if (user.services.facebook) {
    var userData = user.services.facebook;
    var picture = 'http://graph.facebook.com/' + userData.id + '/picture?type=square&height=160&width=160';

    options.profile = {
      'facebook': {
        'name': userData.name,
        'picture': picture
      }
    };
  }

  if (user.services.meetup) {
    var userMeetupId = user.services.meetup.id;
    var apiKey = Meteor.settings.meetup.apiKey;
    var requestUrl = 'https://api.meetup.com/2/member/' + userMeetupId + '?key=' + apiKey + '&signed=true&fields=other_services';
    var response = HTTP.get(requestUrl, {
      params: {
        format: 'json'
      }
    });

    var userData = response.data;
    if(userData.hasOwnProperty("photo") && userData.photo.photo_link !== "") {
      var picture = userData.photo.photo_link;
    } else {
      var picture = "/default-avatar.png";
    }

    options.profile = {
      'meetup': {
        'name': userData.name,
        'picture': picture
      }
    };
  }

  if (options.profile) {
    user.oauths = {};
    user.oauths = options.profile;
  }

  Logger.info('user:' + JSON.stringify(user, null, 2));
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


