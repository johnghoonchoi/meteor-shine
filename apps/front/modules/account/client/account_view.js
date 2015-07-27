
Template.accountView.onCreated(function() {
  var instance = this;
  var data;

  instance.increment = 20;
  instance.limit = new ReactiveVar(instance.increment);
  instance.loaded = new ReactiveVar(0);
  instance.sortBy = function(value) {
    if (value === 'like') {
      return { 'count.likes': -1 };
    } else {
      return { publishedAt: -1 };
    }
  };

  instance.autorun(function() {
    data = Template.currentData();
    var limit = instance.limit.get();
    var sort = instance.sortBy(data.sortBy);

    instance.subscribe('userPostsList', { username: data.username },
      { limit: limit, sort: sort },
      function() { instance.loaded.set(limit); }
    );

    instance.subscribe('userPostsListCount', { username: data.username });

    Navigations.path.set('users');
  });

  instance.user = function() {
    return Meteor.users.findOne({ username: data.username });
  };

  instance.postsCount = function() {
    return Counts.get('userPostsListCount');
  };

  instance.posts = function() {
    var limit = instance.limit.get();
    var sort = instance.sortBy(data.sortBy);

    return Posts.find({ 'author.username': data.username, state: 'PUBLISHED' },
      { limit: limit, sort: sort });
  };
});

Template.accountView.onDestroyed(function() {
  this.limit = null;
  this.loaded = null;
  this.user = null;
  this.postsCount = null;
  this.posts = null;
});


Template.accountView.helpers({
  noPosts: function() {
    return Template.instance().postsCount() === 0;
  },

  user: function() {
    return Template.instance().user();
  },

  postsCount: function() {
    return Template.instance().postsCount();
  },

  posts: function() {
    return Template.instance().posts();
  }

});

Template.accountView.events({
  'click .load-more': function(e, instance) {
    e.preventDefault();
    instance.limit.set(instance.limit.get() + instance.increment);
  }
});
