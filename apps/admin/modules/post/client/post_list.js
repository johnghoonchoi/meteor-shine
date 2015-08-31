Template.postsList.onCreated(function() {
  Navigations.path.set('postsList');

  var instance = this;
  var data = Template.currentData();

  instance.increment = 5;
  instance.limit = new ReactiveVar(instance.increment);

  instance.sortBy = new ReactiveVar('publishedAt');
  instance.sortAsc = new ReactiveVar(-1);

  instance.subscribe('categoriesList', {}, { sort: { seq: 1 }});

  var query = (data.categoryId) ? { categoryId: data.categoryId } : {};
  var limit = instance.limit.get();
  var sort = {};
  sort[instance.sortBy.get()] = instance.sortAsc.get();

  instance.subscribe('postsListCount', query);
  instance.subscribe('postsList', query, { limit: limit, sort: sort });

  instance.categories = function() {
    return Categories.find({}, { sort: { seq: 1 }});
  };

  instance.postsCount = function() {
    return Counts.get('postsListCount');
  };

  instance.autorun(function() {
    instance.posts = function() {
      var query = (data.categoryId) ? { categoryId: data.categoryId } : {};
      var limit = instance.limit.get();
      var sort = {};
      sort[instance.sortBy.get()] = instance.sortAsc.get();

      return Posts.find(query, {limit: limit, sort: sort });
    };
  });
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
  categories: function() {
    return Template.instance().categories();
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
      post = _.extend(post, { author: author });
    }
    return post;
  },

  hasMore: function() {
    var instance = Template.instance();
    return (instance.postsCount() > instance.limit.get());
  }
});

Template.postsList.events({
  'click .load-more': function(e, instance) {
    e.preventDefault();

    instance.limit.set(instance.limit.get() + instance.increment);

    var query = (this.categoryId) ? { categoryId: this.categoryId } : {};
    var limit = instance.limit.get();
    var sort = {};
    sort[instance.sortBy.get()] = instance.sortAsc.get();

    instance.subscribe('postsList', query, { limit: limit, sort: sort });
  }
});


