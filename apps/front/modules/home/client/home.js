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
  instance.default = 0;

  instance.state = new ReactiveDict;
  instance.state.set('limit',  instance.increment);
  instance.state.set('loaded',  instance.default);

  instance.sortBy = function(value) {
    switch(value) {
      case 'like':
        return { 'count.likes': -1 };
        break;
      case 'hit':
        return { 'count.hits': -1 };
        break;
      case 'comment':
        return { 'count.comments': -1 };
        break;
      default:
        return { createdAt: -1 };
    }
  };

  // Control Subscriptions
  instance.autorun(function() {
    data = Template.currentData();

    var limit = instance.state.get('limit');
    var sort = instance.sortBy(data.sortBy);

    instance.subscribe('releasedPostsList',
      {}, { limit: limit, sort: sort},
      function() { instance.state.get('loaded'); });

    console.log('autorun..');
  });

  // Control Cursors
  instance.postsCount = function() {
    return Counts.get('releasedPostsListCount');
  };

  instance.posts = function() {
    return Posts.find({}, { limit: instance.state.get('loaded') });
  };

});

Template.home.onRendered(function() {

});


Template.home.helpers({
  noPosts: function() {
    return Counts.get('releasedPostsListCount') === 0;
  },

  posts: function() {
    return Template.instance().posts();
  },

  hasMore: function() {
    return (Counts.get('releasedPostsListCount') > Template.instance().state.get('limit'));
  },

  isActive: function(type) {
    if (type === this.sortBy) {
      switch(type) {
        case 'like':
          return 'active';
          break;
        case 'hit':
          return 'active';
          break;
        case 'comment':
          return 'active';
          break;
        default:
          return "";
      }
    }
    return (! type && ! this.sortBy) ? "active" : "";
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
