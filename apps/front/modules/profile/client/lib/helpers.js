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
  if (user) {
    if (user.profile && user.profile.picture) {
      if (user.profile.picture.origin) {
        if(user.profile.picture.temp) {
          return 'both'
        }
        return 'onlyOrigin'
      }
      return 'onlyTemp'
    }
    return 'default'
  }
};

/**
 *
 * @returns {string}
 */
getMyPic = function() {
  var user= Meteor.user();
  var flag = myPicState(user);

  if (user) {
    if (flag === 'onlyOrigin' || flag === 'both') {
      var url = user.profile.picture.origin.urlCropped;
      return "<img src='"+url+"'alt='Profile image' class='img-circle'>";
    }
    var initial = makeUppercase(user.username);
    return "<span class='avatar-initials'>"+initial+"</span>";
  }
};

/**
 *
 * @param data context of related template
 * @returns {string}
 * @private
 */
getWriterPic = function(dataContext) {
  if (dataContext) {
    var writer = Meteor.users.findOne({_id: dataContext.user._id});
    if (writer && writer.username) {
      if (writer.profile && writer.profile.picture) {
        var writerPic = writer.profile.picture.origin.urlCropped;
        return "<img src='"+writerPic+"'alt='Profile image' class='img-circle'>";
      }
      var initial = makeUppercase(writer.username);
      return "<span class='avatar-initials'>"+initial+"</span>";
    }
  }
};

Template.registerHelper('firstChar', function(string) {
  return makeUppercase(string);
});

Template.registerHelper('myPic', function() {
  return getMyPic();
});

Template.registerHelper('writerPic', function(dataContext) {
  return getWriterPic(dataContext);
});
