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

var setupFacebookLogin = function() {
  var facebook = Systems.findOne({ _id: 'facebookLogin' });

  if (facebook) {
    ServiceConfiguration.configurations.remove({ service: "facebook" });
    ServiceConfiguration.configurations.insert({
      service: "facebook",
      appId: facebook.appId,
      secret: facebook.secret
    });
  }
};

var setupMeetupLogin = function() {
  var meetup = Systems.findOne({ _id: 'meetupLogin' });

  if (meetup) {
    ServiceConfiguration.configurations.remove({ service: "meetup" });
    ServiceConfiguration.configurations.insert({
      service: "meetup",
      clientId: meetup.clientId,
      secret: meetup.secret,
      apiKey: meetup.apiKey
    });
  }
};



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
    var meetup = Systems.findOne({ _id: 'meetupLogin' });

    var userMeetupId = user.services.meetup.id;
    var apiKey = meetup.apiKey;
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


Meteor.startup(function() {
  setupFacebookLogin();
  setupMeetupLogin();
});
