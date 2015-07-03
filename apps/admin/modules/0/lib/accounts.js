/**
 * returns User display name
 *
 * @param user
 * @returns {*}
 */
userDisplayName = function(user) {
  if (! user)
    return "";

  if (user.name)
    return user.name;

  if (user.username)
    return user.username;

  return user.emails[0].address;
};

if (Meteor.isClient)
  Template.registerHelper('userDisplayName', userDisplayName);
