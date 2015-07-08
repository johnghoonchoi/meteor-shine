Template.accountEdit.onCreated(function() {
  var instance = this;
  var data = Template.currentData();

  instance.account = function() {
    return Meteor.users.findOne({ _id: data.accountId });
  };
});

Template.accountEdit.onDestroyed(function() {
  this.account = null;
});

Template.accountEdit.helpers({
  account: function() {
    return Template.instance().account();
  },

  rolesToString: function() {
    return Template.instance().account().roles.toString();
  }
});
