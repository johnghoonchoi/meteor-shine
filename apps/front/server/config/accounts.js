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
createServiceConfiguration = function(service, clientId, secret) {
  ServiceConfiguration.configurations.remove({
    service: service
  });

  // Note: Facebook and Twitter use different key names for their OAuth client ID
  var config = {
    // google, meetup, github, meteor-developer ..
    generic: {
      clientId: clientId,
      secret: secret,
      loginStyle: 'popup'
    },
    facebook: {
      appId: clientId,
      secret: secret,
      loginStyle: 'popup'
    },
    twitter: {
      consumerKey: clientId,
      secret: secret,
      loginStyle: 'redirect'
    }
    // loginStyle : redirect
    // (ref: https://github.com/meteor/meteor/wiki/OAuth-for-mobile-Meteor-clients)
    //
    // The "redirect" style can be used in situations where a popup window can't be opened,
    // such as in a mobile UIWebView. The "redirect" style however relies on
    // session storage which isn't available in Safari private mode,
    // so the "popup" style will be forced if session storage can't be used.
    // - Inside UIWebViews (when your app is loaded inside a mobile app)
    // - In Safari on iOS8 (window.close is not supported due to a bug)
  };

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
var services = [ 'facebook', 'meetup' ];

for (var i = 0; i < services.length; i++) {
  if (services[i] === 'facebook')
    createServiceConfiguration(services[i], Meteor.settings.facebook.appId, Meteor.settings.facebook.secret);
  if (services[i] === 'meetup')
    createServiceConfiguration(services[i], Meteor.settings.meetup.clientId, Meteor.settings.meetup.secret);
  //if (services[i] === 'twitter')
  //  createServiceConfiguration(services[i], Meteor.settings.twitter.consumerKey, Meteor.settings.twitter.secret);
}


/**
 * check the validation of user information
 * initialize user information
 */
Accounts.onCreateUser(function(options, user) {
  //console.log('options: ' + JSON.stringify(options, null, 2));
  //console.log('user:' + JSON.stringify(user, null, 2));
  //Logger.info('options: ' + JSON.stringify(options, null, 2));

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
    var requestUrl = 'https://api.meetup.com/2/member/' + userMeetupId
      + '?key=' + apiKey + '&signed=true&fields=other_services';
    var response = HTTP.get(requestUrl, {
      params: {
        format: 'json'
      }
    });

    var userData = response.data;

    user.services.meetup = response.data;

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

// Todo: github 버튼 넣어서 테스트해봐야함.. 8월 12일
// https://github.com/splendido/meteor-accounts-meld
// http://test-accounts-meld.meteor.com/
// https://github.com/meteor-useraccounts/core
// https://github.com/artwells/meteor-accounts-guest



/**
 * Set restrictions on new user creation.
 *
 * If any of the functions return false or throw an error, the new user creation is aborted.
 */
Accounts.validateNewUser(function(user) {
  console.log('validateNewUser: ' + JSON.stringify(user, null, 2));
  if (user && user.services.facebook) {
    var newUser = user.services.facebook;
    if (newUser.email) {
      //var thirdPartyUser = Meteor.users.findOne({
      // 'services.email.verificationTokens.0.address': userData.email
      // });
      var pastUser = Meteor.users.findOne({'emails.0.address': newUser.email, 'emails.0.verified': true });
      if (pastUser) {
        console.log(pastUser.emails[0].address+' 이미 동일한 메일의 계정의 존재합니다.');
        throw new Meteor.Error(403, "주소로 이미 회원가입하셨습니다.", { email: pastUser.emails[0].address });
      }
    }
  }

  return true;
});

Accounts.onLoginFailure(function(info) {
  //console.log('info, onLoginFailure: ', info);
  //console.log('email..: ' + JSON.stringify(info.error.details.email, null, 2));
});



/**
 * validate user login
 *
 */
Accounts.validateLoginAttempt(function(attempt) {
  if (!attempt.allowed)
    return false;

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


