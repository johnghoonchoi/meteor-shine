/**
 * returns User display name
 *
 * @param user
 * @returns {*}
 */
//
// helpers
//

userDisplayName = function (user) {
  if (! user)
    return "";

  if (user.profile && user.profile.name)
    return user.profile.name;

  if (user.username)
    return user.username;

  if (user.oauths) {
    var services = [ 'facebook', 'google', 'meetup', 'twitter', 'github', 'meteor-developer', 'kakao', 'naver'];
    for (var i = 0; i < services.length; i++) {
      if (user.oauths[services[i]]) return user.oauths[services[i]].name;
    }
  }

  if (user.emails && user.emails[0] && user.emails[0].address)
    return user.emails[0].address;

  return '';
};

if (Meteor.isClient)
  Template.registerHelper('userDisplayName', userDisplayName);


/**
 *
 * @returns {string}
 * default : there's no user's profile
 * onlyOrigin : only user`s profile image exist
 * both : pending state
 * onlyTemp : pending state
 * @public
 */
myPicState = function(user) {
  //var user= Meteor.user();

  if (!user) return '';

  if (user.profile && user.profile.picture) {
    if (user.profile.picture.origin) {
      if(user.profile.picture.temp) {
        return 'both';
      }
      return 'onlyOrigin';
    }
    return 'onlyTemp';
  }
  return 'default';
};

/**
 *
 * @param str
 * @returns {string}
 * @private
 */
makeUppercase = function(str) {
  return str.slice(0, 1).toUpperCase();
};

if (Meteor.isClient)
  Template.registerHelper('firstChar', makeUppercase);

/**
 *
 * @returns {string}
 */
getPicture = function(user) {
  //var user = Meteor.users.findOne({ _id: userId });
  if (!user) return '';

  if (user) {
    if (user.profile && user.profile.picture) {
      if (user._id === Meteor.userId()) {
        var flag = myPicState(user);
        if (flag === 'onlyOrigin' || flag === 'both') {
          var url = user.profile.picture.origin.urlCropped;
          return "<img src='"+url+"'alt='Profile image' class='img-circle'>";
        }
      }
      var url = user.profile.picture.origin.urlCropped;
      return "<img src='"+url+"'alt='Profile image' class='img-circle'>";
    }

    if (user.oauths) {
      var services = [ 'facebook', 'google', 'meetup', 'twitter', 'github', 'meteor-developer', 'kakao', 'naver'];
      for (var i = 0; i < services.length; i++) {
        if (user.oauths[services[i]]) {
          if (user.oauths[services[i]].picture) {
            return "<img src='" + user.oauths[services[i]].picture + "'alt='Profile image' class='img-circle'>";
          }
          var initial = makeUppercase(user.oauths[services[i]].name);
          return "<span class='avatar-initials'>"+initial+"</span>";
        }
      }
    }

    if (user.profile && user.profile.avatar) {
      var url = user.profile.avatar;
      return "<img src='"+url+"'alt='Profile image' class='img-circle'>";
    }

    if (user.username) {
      var initial = makeUppercase(user.username);
      return "<span class='avatar-initials'>"+initial+"</span>";
    }

    if (user.emails && user.emails[0] && user.emails[0].address) {
      var initial = makeUppercase(user.emails[0].address);
      return "<span class='avatar-initials'>"+initial+"</span>";
    }

  }
};


if (Meteor.isClient)
  Template.registerHelper('getPicture', getPicture);

