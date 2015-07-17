Template.postsList.onCreated(function() {
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

    instance.subscribe('categoryView', data.categoryId);

    instance.subscribe('postsList',
      { categoryId: data.categoryId }, { limit: limit, sort: sort },
      function() { instance.loaded.set(limit); });

    Navigations.path.set('post/category:' + data.categoryId);
  });

  instance.category = function() {
    return Categories.findOne({ _id: data.categoryId });
  };

  instance.postsCount = function() {
    return Counts.get('postListsCount');
  };

  instance.posts = function() {
    return Posts.find({ categoryId: data.categoryId },
      { limit: instance.loaded.get(), sort: { publishedAt: 1 }});
  };

  instance.permission = function(action) {
    var category = instance.category();
    if (! category || ! category.permission)
      return false;


    if (category.permission[action] === 'PUBLIC') {
      return true;
    }

    if (category.permission[action] === 'USER') {
      return Meteor.userId();
    } else if (category.permission[action] === 'PRIVATE') {
      if (Roles.userIsInRole(Meteor.userId(), ['PRIVATE'])) {
        return true;
      }

      return false;
    }

    return true;
  };
});


Template.postsList.onDestroyed(function() {
  this.limit = null;
  this.loaded = null;
  this.category = null;
  this.postsCount = null;
  this.posts = null;
});


Template.postsList.helpers({
  category: function() {
    return Template.instance().category();
  },

  postsCount: function() {
    return Counts.get('postsListCount');
  },

  posts: function() {
    return Template.instance().posts();
  },

  permissionRead: function() {
    return categoryPermitted(Template.instance().category(),
      Meteor.user(), 'read');
  },

  permissionWrite: function() {
    return categoryPermitted(Template.instance().category(),
      Meteor.user(), 'write');
  }
});

Template.postsList.events({
  'click .load-more': function(e, instance) {
    e.preventDefault();
    instance.limit.set(instance.limit.get() + instance.increment);
  }
});
