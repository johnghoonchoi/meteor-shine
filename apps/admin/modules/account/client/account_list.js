"use strict";

Template.accountsList.onCreated(function() {
  Navigations.path.set('accountsList');

  var instance = this;

  instance.pagination = new PagedSubscription({
    name: 'accountsList',
    query: {},
    options: {},
    callback: function() {},
    default: { increment: 5, sort: { username: 1 } },
    loadingTemplate: Template.listLoading
  });

  instance.subscribe('accountsListCount');

  instance.pagination.subscribe(instance);

  instance.accountsCount = function() {
    return Counts.get('accountsListCount');
  };

  instance.autorun(function() {
    instance.accounts = function() {
      return Meteor.users.find({}, {
        limit: instance.pagination.limit.get(),
        sort: instance.pagination.sort.get()
      });
    };
  });
});

/*
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
 */

Template.accountsList.onDestroyed(function() {
  this.pagination = null;
  this.accountsCount = null;
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
    return (instance.accountsCount() > instance.pagination.limit.get());
  }

});

Template.accountsList.events({
  'click th': function(e, instance) {
    var sortBy = e.currentTarget.getAttribute('data-sort');

    if (! sortBy)
      return;

    var sort = instance.pagination.sort.get();
    if (! _.isEmpty(sort)) {
      if (_.keys(sort)[0] === sortBy) {
        sort[sortBy] *= -1;
      } else {
        sort = {};
        sort[sortBy] = 1;
      }
    } else {
      sort = {};
      sort[sortBy] = 1;
    }

    instance.pagination.sort.set(sort);
    instance.pagination.subscribe(instance);
  },

  'click #load-more': function(e, instance) {
    e.preventDefault();
/*
    instance.limit.set(instance.limit.get() + instance.increment);

    var limit = instance.limit.get();
    var sort = {};
    sort[instance.sortBy.get()] = instance.sortAsc.get();
    instance.subscribe('accountsList', { limit: limit, sort: sort });
*/
    instance.pagination.limitInc();
    instance.pagination.subscribe(instance);
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
