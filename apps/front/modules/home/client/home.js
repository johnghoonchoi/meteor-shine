// var triggerHandle;

// Template.home.onRendered(function() {
//   triggerHandle = InfiniteScrollTrigger.bind(function() {
//     Router.go(Router.current().nextPath());
//   });
// });

// Template.home.onDestroyed(function() {
//   if (triggerHandle)
//     InfiniteScrollTrigger.unbind(triggerHandle);
// });

Template.home.onCreated(function() {
  var instance = this;

  //var data = Template.currentData();
  //console.log('data: ', data);

  instance.increment = 5;
  instance.limit = new ReactiveVar(instance.increment);
  instance.loaded = new ReactiveVar(0);

  //console.log('instance: ', instance);
  //console.log('instance.increment: ', instance.increment);
  //console.log('instance.limit: ', instance.limit);
  //console.log('instance.loaded: ', instance.loaded);

  // Control Subscriptions
  instance.autorun(function() {
    var limit = instance.limit.get();
    //console.log('limit: ', limit);

    instance.subscribe('blogsList',
      {}, { limit: limit, sort: { createdAt: -1 }},
      function() { instance.loaded.set(limit); });
  });

  // Control Cursors
  instance.blogsCount = function() {
    return Counts.get('blogsCount');
  };

  instance.blogs = function() {
    return Blogs.find({}, {
      limit: instance.loaded.get(), sort: { createdAt: -1}
    });
  };

});

Template.home.helpers({
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


Template.home.events({
  'click .load-more': function (e, instance) {
    e.preventDefault();
    instance.limit.set(instance.limit.get() + instance.increment);
    //Router.go(Router.current().nextPath());
  },

  //'click #alert-test': function() {
  //  Alerts.dialog('alert', 'Hi there...', function() {
  //    console.log('done...');
  //  });
  //},

  'click .title-link': function() {
    Meteor.call('hitUpdate', this._id, function(error, result) {
      if (error) console.log('error.reason: ', error.reason);

      console.log('hit result: ', result);
    });
  }
});


Template.homeListItem.helpers({
  blogContent: function() {
    var content = this.content;
    //return content.replace(/<(?:.|\n)*?>/gm, '');
    //return content.replace(/(<([^>]+)>)/ig, "");
    return content;
  },

  commentCount: function() {
    return (this.count && this.count.comment) ? this.count.comment : 0;
  },

  hitsCount: function() {
    return (this.count && this.count.hits) ? this.count.hits : 0;
  },

  likesCount: function() {
    return (this.count && this.count.likes) ? this.count.likes : 0;
  },

  ownBlog: function() {
    return this.user._id === Meteor.userId();
  }
});

/*
Template.home.events({
  'change input[name=theme]': function(e) {
    e.preventDefault();

    var theme = $(e.target).val();
    $('body').attr('class', '');
    if (theme !== 'none') {
      $('body').addClass(theme);
    }
  }
});
*/
