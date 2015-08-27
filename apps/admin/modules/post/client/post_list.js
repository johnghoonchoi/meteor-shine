Template.postsList.onCreated(function() {
  var instance = this;
  var data;

  instance.increment = 10;
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

  var query, limit, sort;

  Navigations.path.set('postsList');

  instance.autorun(function() {

    data = Template.currentData();

    query = (data.categoryId) ? { categoryId: data.categoryId } : {};
    limit = instance.limit.get();
    sort = instance.sortBy(data.sortBy);

    console.log('query: ' + JSON.stringify(query));

    instance.subscribe('postsListCount', query);

    instance.subscribe('postsList', query, { limit: limit, sort: sort },
      function() {
        instance.loaded.set(limit);
      }
    );
  });




  instance.postsCount = function() {
    return Counts.get('postListsCount');
  };

  instance.posts = function() {
    var query = (data.categoryId) ? { categoryId: data.categoryId } : {};

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
    if (post && post.author) {
      var author = Meteor.users.findOne(post.author._id);
      return _.extend(post, { author: author });
    } else {
      return "";
    }
  },

  hasMore: function() {
    var instance = Template.instance();
    return (instance.postsCount() > instance.loaded/*.get()*/);
  }
});

Template.postsList.events({
  'click .load-more': function(e, instance) {
    e.preventDefault();
    instance.limit.set(instance.limit.get() + instance.increment);
  }
});


