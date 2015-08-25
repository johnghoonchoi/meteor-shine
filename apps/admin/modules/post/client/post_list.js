Template.postsList.onCreated(function() {
  var instance = this;
  var data;

  instance.increment = 10;
  instance.categories = new ReactiveVar();;
  instance.limit = new ReactiveVar(instance.increment);
  instance.loaded = new ReactiveVar(0);
  instance.sortBy = function(value) {
    if (value === 'like') {
      return { 'count.likes': -1 };
    } else {
      return { publishedAt: -1 };
    }
  };

  instance.subscribe('categoriesList', {}, { sort: { seq: 1 }});

  var query;

  instance.autorun(function() {
    data = Template.currentData();

    query = (instance.categories.get()) ?
      { $in: { categoryId: instance.categoryId.get() }} : {};

    var limit = instance.limit.get();
    var sort = instance.sortBy(data.sortBy);

    instance.subscribe('postsListCount', query);

    instance.subscribe('postsList', query, { limit: limit, sort: sort },
      function() {
        instance.loaded.set(limit);
      }
    );

    Navigations.path.set('postsList');
  });


  instance.postsCount = function() {
    return Counts.get('postListsCount');
  };

  instance.posts = function() {
    var categoryId = instance.categoryId ? instance.categoryId.get() : null;
    var query = (categoryId) ? { categoryId: categoryId } : {};
    return Posts.find(query, {
      limit: instance.loaded.get(), sort: { publishedAt: 1 }
    });
  };
});


Template.postsList.onDestroyed(function() {
  this.categoryId = null;
  this.limit = null;
  this.loaded = null;
  this.sortBy = null;
  this.postsCount = null;
  this.posts = null;
});


Template.postsList.helpers({
  category: function() {
    return Template.instance().category();
  },

  postsCount: function() {
    return Template.instance().postsCount();
  },

  posts: function() {
    return Template.instance().posts();
  },

  postWithUser: function() {
    var post = this;
    var author = Meteor.users.findOne(post.author._id);
    return _.extend(post, { author: author });
  },

  hasMore: function() {
    var instance = Template.instance();
    return (instance.postsCount() > instance.loaded.get());
  }
});

Template.postsList.events({
  'click .load-more': function(e, instance) {
    e.preventDefault();
    instance.limit.set(instance.limit.get() + instance.increment);
  }
});


