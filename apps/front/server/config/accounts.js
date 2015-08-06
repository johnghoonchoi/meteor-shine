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
    clientId: Meteor.settings.meetup.oauthKey,
    secret: Meteor.settings.meetup.oauthSecret
  });
}


/**
 * check the validation of user information
 * initialize user information
 */
Accounts.onCreateUser(function(options, user) {
  console.log('options: ' + JSON.stringify(options, null, 2));
  Logger.info('options: ' + JSON.stringify(options, null, 2));

  if (user.services.facebook) {
    var userData = user.services.facebook;
    var userFacebookId= userData.id;
    var name= userData.name;
    var thumbnailUrl = 'http://graph.facebook.com/' + userFacebookId + '/picture?type=square&height=160&width=160';

    options.profile = {
      'name': userData.name,
      'facebookProfileUrl': userData.link,
      'thumbnailUrl': thumbnailUrl
    };

    user.profile = options.profile;
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
      var thumbnailUrl = userData.photo.photo_link;
    } else {
      var thumbnailUrl = "/default-avatar.png";
    }

    var socialLinks = [];
    for (service in userData.other_services) {
      if(service === "twitter") {
        var username = userData.other_services['twitter']['identifier'];
        socialLinks.push({'service': 'twitter', 'url': 'https://twitter.com/' + username});
      } else if(service) {
        var url = userData.other_services[service]['identifier'];
        socialLinks.push({'service': service, 'url': url});
      }
    }

    options.profile = {
      'name': userData.name,
      'meetupProfileUrl': userData.link,
      'thumbnailUrl': thumbnailUrl,
      'bio': userData.bio,
      'socialLinks': socialLinks
    };
    user.profile = options.profile;
  }


  console.log('user:' + JSON.stringify(user, null, 2));
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


