
Template.accountsList.onCreated(function() {
  Navigations.path.set('accountsList');

  var instance = this;

  instance.increment = 4;
  instance.limit = new ReactiveVar(instance.increment);
  instance.loaded = new ReactiveVar(0);

  instance.autorun(function() {
    var limit = instance.limit.get();
    var sort = { createdAt: -1 };

    instance.subscribe('accountsList', { limit: limit, sort: sort },
      function() { instance.loaded.set(limit); });
  });

  instance.accountsCount = function() {
    return Counts.get('accountsListCount');
  };

  instance.accounts = function() {
    return Meteor.users.find({},
      { limit: instance.loaded.get(), sort: { createdAt: -1 }});
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
  },

  hasMore: function() {
    var instance = Template.instance();
    return (instance.accountsCount() > instance.loaded.get());
  }
});

Template.accountsList.events({
  'click #load-more': function(e, instance) {
    e.preventDefault();

    instance.limit.set(instance.limit.get() + instance.increment);
  }
});

Template.accountsListItem.helpers({
  oauthName: function() {
    if (! this.oauths) {
      return "";
    }

    if (this.oauths.meetup) {
      return this.oauths.meetup.name;
    }

    if (this.oauths.facebook) {
      return this.oauths.facebook.name;
    }
  },

  email: function() {
    return (this.emails && this.emails[0]) ? this.emails[0].address : "";
  }
});
