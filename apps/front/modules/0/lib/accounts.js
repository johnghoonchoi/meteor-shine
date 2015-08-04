/**
 * returns User display name
 *
 * @param user
 * @returns {*}
 */
//
// helpers
//

userDisplayName = function () {
  var user = Meteor.user();
  if (!user)
    return '';

  if (user.profile && user.profile.name)
    return user.profile.name;
  if (user.username)
    return user.username;
  if (user.emails && user.emails[0] && user.emails[0].address)
    return user.emails[0].address;

  if (user.services && user.services.facebook)
    if (user.services.facebook.name) return user.services.facebook.name;
  if (user.services.facebook.email) return user.services.facebook.email;

  return '';
};

if (Meteor.isClient)
  Template.registerHelper('userDisplayName', userDisplayName);

userPicHelper = function() {
  var user = Meteor.user();
  if (!user)
    return '';

  if (user.profile && ! user.profile.picture ) {
    if (user.services && user.services.facebook) {
      var id = user.services.facebook.id;
      var img = 'http://graph.facebook.com/' + id + '/picture?type=square&height=160&width=160';
      return '<img src='+img+'>';
    }
  }
};

if (Meteor.isClient)
  Template.registerHelper('userPicHelper', userPicHelper);
