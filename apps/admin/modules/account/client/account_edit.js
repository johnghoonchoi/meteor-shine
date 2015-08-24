Template.accountEdit.onCreated(function() {
  Navigations.path.set('accountsList');

  var instance = this;
  var data;

  instance.autorun(function() {
    data = Template.currentData();
    instance.subscribe('accountView', data.accountId, function() {
      data.account = Meteor.users.findOne({ _id: data.accountId });
    });
  });

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
    var account = Template.instance().account();
    return (account && account.roles) ?
      Template.instance().account().roles.toString() : "";
  }
});

Template.accountEdit.events({
  'click #cancel': function(e) {
    e.preventDefault();

    history.back(-1);
  }
});
