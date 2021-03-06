momentFormat = function(time, format) {
  return (time) ? moment(time).format(format) : "";
};

if (Meteor.isClient)
  Template.registerHelper('momentFormat', momentFormat);

momentFromNow = function(time) {
  return moment(time).fromNow();
};

if (Meteor.isClient)
  Template.registerHelper('momentFromNow', momentFromNow);

