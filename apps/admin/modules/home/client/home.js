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

