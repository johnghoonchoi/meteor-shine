/**
 *
 * @returns number
 *  0 : there's no user's profile
 *  1 : user`s profile image exist, but new image not yet uploaded
 *  2 : new uploaded temporary image
 *
 */
profilePictureState = function() {
  var user = Meteor.user();
  if (user && user.profile && user.profile.picture) {
    return (user.profile.picture.temp) ?  2 : 1;
  }

  return 0;
};

authorProfile = function(self) {
  var doc = self;
  if (doc) {
    var author = Meteor.users.findOne({_id: doc.user._id});
    if (author) {
      if (author.profile && author.profile.picture) {
        var url = author.profile.picture.origin.urlCropped;

        return "<img src='"+url+"'alt='Profile image' class='img-circle'>";
      } else if (author.username) {
        var firstChar = makeUpperCase(author.username);

        return "<span class='avatar-initials'>"+firstChar+"</span>";
      }
    }
  }
};

makeUpperCase = function(str) {
  return str.slice(0, 1).toUpperCase();
};

_getAccountPicture = function() {
  var user = Meteor.user();
  var flag = profilePictureState();
  if (flag === 1) {
    var url = user.profile.picture.origin.urlCropped;
    return "<img src='"+url+"'alt='Profile image' class='img-circle'>";
  } else if (flag === 0) {
    var firstChar = makeUpperCase(user.username);
    return "<span class='avatar-initials'>"+firstChar+"</span>";
  }
};

Template.registerHelper('accountPicture', function() {
  return _getAccountPicture();
});
Template.registerHelper('defaultImage', function(username) {
  return _makeUpperCase(username);
});
Template.registerHelper('authorPicture', function(self) {
  return authorProfile(self);
});
