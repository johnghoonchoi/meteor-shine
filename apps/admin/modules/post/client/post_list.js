Template.postsList.onCreated(function() {
  var instance = this;
  var data;

  instance.categoryId = new ReactiveVar();;
  instance.increment = 5;
  instance.limit = new ReactiveVar(instance.increment);
  instance.loaded = new ReactiveVar(0);
  instance.totalCount = new ReactiveVar(0);
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

    instance.subscribe('categoriesList', {}, { sort: { seq: 1 }});

    var query = (instance.categoryId.get()) ?
      { categoryId: instance.categoryId.get() } : {};

    instance.subscribe('postsList', query, { limit: limit, sort: sort },
      function() {
        instance.loaded.set(limit);
        instance.totalCount.set(Counts.get('postListsCount'));
//        data.totalCount = Counts.get('postListsCount');
      }
    );

    Navigations.path.set('postsList');
  });

  instance.postsCount = function() {
    //var count = Counts.get('postListsCount');
    //console.log('count = ' + count);
    return instance.totalCount.get();
  };

  instance.posts = function() {
    var categoryId = instance.categoryId.get();
    var query = (categoryId) ? { categoryId: categoryId } : {};
    return Posts.find(query, {
      limit: instance.loaded.get(), sort: { publishedAt: 1 }
    });
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
    return Template.instance().postsCount();
//    return this.totalCount;
  },

  posts: function() {
    return Template.instance().posts();
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
