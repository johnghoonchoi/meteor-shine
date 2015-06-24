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

Template.blogsList.events({
  'click .load-more': function () {
    Router.go(Router.current().nextPath());
  }
});


Template.blogsList.helpers({
  noBlogs: function() {
    return Counts.get('blogsCount') === 0;
  },
  blogsCount: function() {
    return Counts.get('blogsCount');
  }
});

Template.blogsList.onCreated(function() {
  var instance = this;

  instance.limit = new ReactiveVar(5);
  instance.loaded = new ReactiveVar(0);

  instance.autorun(function() {
    instance.subscribe('blogsList', {
      onReady: function() {
        instance.loaded.set(instance.limit.get());
      }
    });
/*
    if (Template.instance().subscriptionsReady()) {
      console.log('> subscriptions ready.');
    } else {
      console.log('> subscriptions NOT ready...');
    }
*/
  });

  instance.blogs = function() {
    return Blogs.find({});
  };
});

Template.blogsListItem.helpers({
  blog_content: function() {
    var content = this.content;
    //return content.replace(/<(?:.|\n)*?>/gm, '');
    //return content.replace(/(<([^>]+)>)/ig, "");
    return content;
  },
  commentCount: function() {
    return BlogComments.find({blogId: this._id}).count();
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
