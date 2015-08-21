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

  if (user.oauths) {
    if (user.oauths.facebook)
      return user.oauths.facebook.name;

    if (user.oauths.meetup)
      return user.oauths.meetup.name;
  }

  if (user.username)
    return user.username;

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
getPicture = function(userId) {
  var user = Meteor.users.findOne({ _id: userId });
  if (!user) return '';

  if (user) {
    if (user.profile && user.profile.picture) {
      var flag = myPicState(user);
      if (flag === 'onlyOrigin' || flag === 'both') {
        var url = user.profile.picture.origin.urlCropped;
        return "<img src='"+url+"'alt='Profile image' class='img-circle'>";
      }
    }

    if (user.oauths) {
      if (user.oauths.facebook && user.oauths.facebook.picture) {
        return "<img src='"+user.oauths.facebook.picture+"'alt='Profile image' class='img-circle'>";
      }
      if (user.oauths.meetup && user.oauths.meetup.picture) {
        return "<img src='"+user.oauths.meetup.picture+"'alt='Profile image' class='img-circle'>";
      }
    }

    if (user.username) {
      var initial = makeUppercase(user.username);
      return "<span class='avatar-initials'>"+initial+"</span>";
    }
  }
};


if (Meteor.isClient)
  Template.registerHelper('getPicture', getPicture);

