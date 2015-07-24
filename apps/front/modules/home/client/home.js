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
  Navigations.path.set('home');

  var instance = this;
  var data;

  instance.increment = 5;
  instance.limit = new ReactiveVar(instance.increment);
  instance.loaded = new ReactiveVar(0);

  instance.sortBy = function(value) {
    if (value === 'like') {
      return { 'count.likes': -1 };
    } else {
      return { createdAt: -1 };
    }
  };

  // Control Subscriptions
  instance.autorun(function() {
    data = Template.currentData();

    var limit = instance.limit.get();
    var sort = instance.sortBy(data.sortBy);

    instance.subscribe('releasedPostsList',
      {}, { limit: limit, sort: sort},
      function() { instance.loaded.set(limit); });

    console.log('autorun..');
  });

  // Control Cursors
  instance.postsCount = function() {
    return Counts.get('releasedPostsListCount');
  };

  instance.posts = function() {
    return Posts.find({}, { limit: instance.loaded.get() });
  };

});

Template.home.onRendered(function() {

});


Template.home.helpers({
  noPosts: function() {
    return Template.instance().postsCount() === 0;
  },

  postsCount: function() {
    return Template.instance().postsCount();
  },

  posts: function() {
    return Template.instance().posts();
  },

  hasMore: function() {
    return (Template.instance().postsCount() > Template.instance().limit.get());
  },

  active: function(type) {
    if (type === 'like') {
      return (this.sortBy === 'like') ? "active" : "";
    }
    return (this.sortBy !== 'like') ? "active" : "";
  }
});


Template.home.events({
  'click .load-more': function (e, instance) {
    e.preventDefault();
    instance.limit.set(instance.limit.get() + instance.increment);
    //Router.go(Router.current().nextPath());
  },

  'click .title-link': function() {
    Meteor.call('hitUpdate', this._id, function(error, result) {
      if (error) console.log('error.reason: ', error.reason);

      console.log('hit result: ', result);
    });
  }

  //'click #alert-test': function() {
  //  Alerts.dialog('alert', 'Hi there...', function() {
  //    console.log('done...');
  //  });
  //},
});


Template.homeListItem.helpers({
  postContent: function() {
    var content = this.content.data;
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

  ownPost: function() {
    return this.user._id === Meteor.userId();
  }
});
