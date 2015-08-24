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
 * First, have to add the configuration package for a various of external login services:
 * `meteor add service-configuration`
 */

/**
 * Second, have to add an external login service you need to want to use
 * `meteor add accounts-facebook`
 * `meteor add accounts-google`
 * `meteor add accounts-twitter`
 * `meteor add accounts-meetup`
 * `meteor add accounts-github`
 * `meteor add accounts-meteor-developer`
 *  ...
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

var setupGoogleLogin = function() {
  var google = Systems.findOne({ _id: 'googleLogin' });

  if (google) {
    ServiceConfiguration.configurations.remove({ service: "google" });
    ServiceConfiguration.configurations.insert({
      service: "google",
      clientId: google.clientId,
      secret: google.secret
    });
  }
};

var setupTwitterLogin = function() {
  var twitter = Systems.findOne({ _id: 'twitterLogin' });

  if (twitter) {
    ServiceConfiguration.configurations.remove({ service: "twitter" });
    ServiceConfiguration.configurations.insert({
      service: "twitter",
      consumerKey: twitter.consumerKey,
      secret: twitter.secret
    })
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

var setupGithubLogin = function() {
  var github = Systems.findOne({ _id: 'githubLogin' });

  if (github) {
    ServiceConfiguration.configurations.remove({ service: "github" });
    ServiceConfiguration.configurations.insert({
      service: "github",
      clientId: github.clientId,
      secret: github.secret
    })
  }
};

var setupMeteorLogin = function() {
  var meteor = Systems.findOne({ _id: 'meteorLogin' });

  if (meteor) {
    ServiceConfiguration.configurations.remove({ service: "meteor-developer" });
    ServiceConfiguration.configurations.insert({
      service: "meteor-developer",
      clientId: meteor.clientId,
      secret: meteor.secret
    })
  }
};

//var setupLinkedInLogin = function() {
//  var linkedIn = Systems.findOne({ _id: 'linkedInLogin' });
//
//  if (!linkedIn) {
//    ServiceConfiguration.configurations.remove({ service: "linkedIn" });
//    ServiceConfiguration.configurations.insert({
//      service: "linkedIn",
//      clientId: Meteor.settings.linkedIn.clientId,
//      secret: Meteor.settings.linkedIn.secret
//    })
//  }
//};

/**
 *  have to add an external login services for Korean
 * `meteor add accounts-naver`
 * `meteor add accounts-kakao`
 */
var setupNaverLogin = function() {
  var naver = Systems.findOne({ _id: 'naverLogin' });

  if (naver) {
    ServiceConfiguration.configurations.remove({ service: "naver" });
    ServiceConfiguration.configurations.insert({
      service: "naver",
      clientId: naver.clientId,
      secret: naver.secret,
      loginStyle: 'popup'
    });
  }
};

var setupKakaoLogin = function() {
  var kakao = Systems.findOne({ _id: 'kakaoLogin' });

  if (kakao) {
    ServiceConfiguration.configurations.remove({ service: "kakao" });
    ServiceConfiguration.configurations.insert({
      service: "kakao",
      clientId: kakao.clientId,
      loginStyle: 'popup'
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
      facebook: {
        name: userData.name,
        picture: picture
      }
    };
  }

  if (user.services.google) {
    var userData = user.services.google;
    options.profile = {
      google: {
        name: userData.name,
        picture: userData.picture
      }
    };
  }

  if (user.services.twitter) {
    var userData = user.services.twitter;
    var name = options.profile.name;
    options.profile = {
      twitter: {
        name: name,
        picture: userData.profile_image_url_https
      }
    };
  }

  if (user.services.github) {
    console.log('options.profile: ', options.profile);
    var name = options.profile.name;
    options.profile = {
      github: {
        name: name,
        picture: '/default_avatar.png'
      }
    };
  }

  if (user.services['meteor-developer']) {
    var name = options.profile.name;
    options.profile = {
      'meteor-developer': {
        name: name,
        picture: '/default_avatar.png'
      }
    };
  }

  if (user.services.meetup) {
    var meetup = Systems.findOne({ _id: 'meetupLogin' });

    var userMeetupId = user.services.meetup.id;
    var apiKey = meetup.apiKey;
    var requestUrl = 'https://api.meetup.com/2/member/' + userMeetupId
      + '?key=' + apiKey + '&signed=true&fields=email';
    var response = HTTP.get(requestUrl, {
      params: {
        format: 'json'
      }
    });

    var userData = response.data;

    user.services.meetup = response.data;

    if(userData.photo && userData.photo.photo_link) {
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

  if (user.services.naver) {
    var userData = user.services.naver;
    userData = _.extend(userData, options.profile);
    options.profile = {
      naver: {
        name: userData.name,
        picture: userData.profile_image
      }
    }
  }

  if (user.services.kakao) {
    var userData = user.services.kakao;
    userData = _.extend(userData, options.profile);
    options.profile = {
      kakao: {
        name: userData.name,
        picture: userData.profile_image
      }
    }
  }


  if (options.profile) {
    user.oauths = {};
    user.oauths = options.profile;
  }

  Logger.info('1 new user created.. ' + JSON.stringify(user, null, 2));
  return user;
/*
  var validation = AccountValidator.validateInsert(options);

  if (! _.isEmpty(validation.errors())) {
    throw new Meteor.Error(ERROR_CODE_MATCH, 'error_validation');
  }
*/
});


/**
 * Set restrictions on new user creation.
 *
 * If any of the functions return false or throw an error, the new user creation is aborted.
 */
Accounts.validateNewUser(function(user) {
  console.log('validateNewUser..');
  //if (user && user.services.facebook) {
  //  var newUser = user.services.facebook;
  //  if (newUser.email) {
  //    //var thirdPartyUser = Meteor.users.findOne({
  //    // 'services.email.verificationTokens.0.address': userData.email
  //    // });
  //    var pastUser = Meteor.users.findOne({'emails.0.address': newUser.email, 'emails.0.verified': true });
  //    if (pastUser) {
  //      console.log(pastUser.emails[0].address+' 이미 동일한 메일의 계정의 존재합니다.');
  //      throw new Meteor.Error(403, "주소로 이미 회원가입하셨습니다.", { email: pastUser.emails[0].address });
  //    }
  //  }
  //}

  return true;
});


Accounts.onLogin(function(info) {
  Meteor.users.update({ _id: info.user._id },
    { $set: { loginAt: new Date() }});
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

Accounts.onLogin(function(info) {
  //console.log('info, onLoginFailure: ', info);
  //console.log('email..: ' + JSON.stringify(info.error.details.email, null, 2));
});

Accounts.onLoginFailure(function(info) {
  //console.log('info, onLoginFailure: ', info);
  //console.log('email..: ' + JSON.stringify(info.error.details.email, null, 2));
});

Meteor.startup(function() {
  setupFacebookLogin();
  setupGoogleLogin();
  setupMeteorLogin();
  setupGithubLogin();
  setupMeetupLogin();
  setupTwitterLogin();
  //setupLinkedInLogin();

  setupNaverLogin();
  setupKakaoLogin();
});
