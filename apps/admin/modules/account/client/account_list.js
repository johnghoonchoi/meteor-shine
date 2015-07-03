
Template.accountsList.onCreated(function() {
  var instance = this;

  instance.increment = 10;
  instance.limit = new ReactiveVar(instance.increment);
  instance.loadead = new ReactiveVar(0);

  instance.autorun(function() {
    var limit = instance.limit.get();
    var sort = { createdAt: -1 };

    instance.subscribe('accountsList', { limit: limit, sort: sort });
  });

  instance.accountsCount = function() {
    return Counts.get('accountsListCount');
  };

  instance.accounts = function() {
    return Meteor.users.find({},
      { limit: instance.loadead.get(), sort: { createdAt: -1 }});
  };
});

Template.accountsList.onDestroyed(function() {
  this.limit = null;
  this.loadead = null;
  this.accounts = null;
});


Template.accountsList.helpers({
  accountsCount: function() {
    return Template.instance().accountsCount();
  },

  accounts: function() {
    return Template.instance().accounts();
  }
});

Template.accountsList.events({

});
