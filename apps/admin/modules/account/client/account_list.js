
Template.accountsList.onCreated(function() {
  Navigations.path.set('accountsList');

  var instance = this;

  instance.sortBy = new ReactiveVar('username');
  instance.sortAsc = new ReactiveVar(1);

  instance.subscribe('accountsListCount');

  instance.pagination = new PagedSubscription({ increment: 5 });

  var sort = {};
  sort[instance.sortBy.get()] = instance.sortAsc.get();
  instance.pagination.first('accountsList', {}, { sort: sort });

  instance.accountsCount = function() {
    return Counts.get('accountsListCount');
  };

  instance.autorun(function() {
    instance.accounts = function() {
      var sort = {};
      sort[instance.sortBy.get()] = instance.sortAsc.get();

      var cursor = Meteor.users.find({},
        { limit: instance.pagination.getLimit(), sort: sort });

      instance.pagination.setLoaded(cursor.count());

      return cursor;
    };
  });
});

Template.accountsList.onDestroyed(function() {
  this.limit = null;
  this.loaded = null;
  this.accounts = null;
});

Template.accountsList.helpers({
  accountsCount: function() {
    return Template.instance().accountsCount();
  },

  accounts: function() {
    return Template.instance().accounts();
  },

  paging: function() {
    return Template.instance().pagination;
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

/*
Template.accountsListPaging.helpers({
  ready: function() {
    var handle = Template.instance().handle;
    return (handle) ? handle.ready() : true;
  },

  hasMore: function() {
    return (this.limit.get() === this.loaded.get());
  }
});

Template.accountsListPaging.events({
  'click #load-more': function(e, instance) {
    e.preventDefault();

    var data = Template.currentData();
    data.limit.set(data.limit.get() + data.increment);
    instance.handle = data.subscribe(data.limit.get());
  }
});
*/
