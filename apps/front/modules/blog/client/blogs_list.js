//var triggerHandle;

// Template.blogsList.onRendered(function() {
//   triggerHandle = InfiniteScrollTrigger.bind(function() {
//     if (Router.current().nextPath())
//       Router.go(Router.current().nextPath());
//   });
// });

// Template.blogsList.onDestroyed(function() {
//   if (triggerHandle)
//     InfiniteScrollTrigger.unbind(triggerHandle);
// });

Template.blogsList.onCreated(function() {
  var instance = this;

  instance.increment = 2;
  instance.limit = new ReactiveVar(instance.increment);
  instance.loaded = new ReactiveVar(0);


  instance.autorun(function() {
    var limit = instance.limit.get();

    instance.subscribe('blogsList',
      {}, { limit: limit, sort: { createdAt: -1 }},
      function() { instance.loaded.set(limit); });
  });

  instance.blogsCount = function() {
    return Counts.get('blogsCount');
  };

  instance.blogs = function() {
    return Blogs.find({}, {
      limit: instance.loaded.get(), sort: { createdAt: 1 }
    });
  };

});

Template.blogsList.helpers({
  noBlogs: function() {
    return Template.instance().blogsCount() === 0;
  },

  blogsCount: function() {
    return Template.instance().blogsCount();
  },

  blogs: function() {
    return Template.instance().blogs();
  },

  hasMore: function() {
    return (Template.instance().blogsCount() > Template.instance().limit.get());
  }
});

Template.blogsList.events({
  'click .load-more': function(e, instance) {
    e.preventDefault();
    instance.limit.set(instance.limit.get() + instance.increment);
  }
});


Template.blogsListItem.helpers({
  blog_content: function() {
    var content = this.content;
    //return content.replace(/<(?:.|\n)*?>/gm, '');
    //return content.replace(/(<([^>]+)>)/ig, "");
    return content;
  },

  commentCount: function() {
    return (this.count && this.count.comment) ? this.count.comment : 0;
  },

  ownBlog: function() {
    return this.user._id === Meteor.userId();
  }
});

Template.blogsListItem.events({
  'click .delete-btn': function(e, template) {
    e.preventDefault();
    console.log('this.id: ', this._id);

    Meteor.call('blogRemove', this._id, function(error, result) {
      if (error) console.log('error: ', error);
      console.log('result: ', result);
    });
  }
});
