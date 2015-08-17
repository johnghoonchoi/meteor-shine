/**
 * set layout and theme
 */

Template.layout.onCreated(function() {
  var instance = this;

  instance.theme = "modern";
});

Template.layout.helpers({
  layoutTemplate: function() {
    return "layout" + Template.instance().theme.capitalize();
  }
});
