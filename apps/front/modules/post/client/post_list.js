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

    instance.subscribe('categoryView', data.category);

    instance.subscribe('postsList',
      { categoryId: data.category }, { limit: limit, sort: sort },
      function() { instance.loaded.set(limit); });

    Breadcrumbs.path.set('post/category:' + data.category);
  });

  instance.category = function() {
    return Categories.findOne({ _id: data.category });
  };

  instance.postsCount = function() {
    return Counts.get('postListsCount');
  };

  instance.posts = function() {
    return Posts.find({ categoryId: data.category },
      { limit: instance.loaded.get(), sort: { publishedAt: 1 }});
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
  }
});

Template.postsList.events({
  'click .load-more': function(e, instance) {
    e.preventDefault();
    instance.limit.set(instance.limit.get() + instance.increment);
  }
});
