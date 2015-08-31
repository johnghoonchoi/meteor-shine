"use strict";

Template.accountsList.onCreated(function() {
  Navigations.path.set('accountsList');

  var instance = this;

  instance.sortBy = new ReactiveVar('username');
  instance.sortAsc = new ReactiveVar(1);

  instance.increment = 5;
  instance.limit = new ReactiveVar(instance.increment);

  instance.subscribe('accountsListCount');

  var limit = instance.limit.get();
  var sort = {};
  sort[instance.sortBy.get()] = instance.sortAsc.get();
  instance.subscribe('accountsList', { limit: limit, sort: sort });

  instance.accountsCount = function() {
    return Counts.get('accountsListCount');
  };

  instance.autorun(function() {
    instance.accounts = function() {
      let limit = instance.limit.get();
      let sort = {};
      sort[instance.sortBy.get()] = instance.sortAsc.get();

      return Meteor.users.find({}, { limit: limit, sort: sort });
    };
  });
});

Template.accountsList.onDestroyed(function() {
  this.limit = null;
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
    return (instance.accountsCount() > instance.limit.get());
  }
});

Template.accountsList.events({
  'click th': function(e, instance) {
    var sortBy = e.currentTarget.getAttribute('data-sort');
    var sort = {};

    if (sortBy) {
      if (instance.sortBy.get() === sortBy) {
        instance.sortAsc.set(instance.sortAsc.get() * -1);
      } else {
        instance.sortBy.set(sortBy);
      }
    }
  },

  'click #load-more': function(e, instance) {
    e.preventDefault();

    instance.limit.set(instance.limit.get() + instance.increment);

    var limit = instance.limit.get();
    var sort = {};
    sort[instance.sortBy.get()] = instance.sortAsc.get();
    instance.subscribe('accountsList', { limit: limit, sort: sort });
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
