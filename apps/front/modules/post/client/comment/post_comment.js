
Template.postCommentNew.onCreated(function() {
  var instance = this;
  instance.data = Template.currentData();
});

Template.postCommentNew.events({
  'submit #formPostCommentNew': function(e, instance) {
    e.preventDefault();

    var object = {
      postId: Template.parentData(1).postId,
      msg: $(e.currentTarget).find('[name=msg]').val().trim()
    };

    Meteor.call('postCommentInsert', object, function(error) {
      if (error) {
        Alerts.notify('error', error.reason);
      } else {
        $(e.target).find('[name=msg]').val('');

        instance.data.count.set(instance.data.commentsCount());

        var frame = $('.comments-list-frame');
        frame.animate({ scrollTop: frame[0].scrollHeight }, "slow");
      }
    });
  }
});


Template.postCommentsList.onCreated(function() {
  var instance = this;
  var data = Template.currentData();

  instance.increment = 5;
  instance.limit = new ReactiveVar(instance.increment);
  instance.loaded = new ReactiveVar(0);
  instance.data.count = new ReactiveVar(0);

  instance.autorun(function() {
    var limit = instance.limit.get();
    instance.subscribe('postCommentsList', { postId: data.postId },
      { limit: limit, sort: { createdAt: -1 }});
    instance.data.count.get();
  });

  instance.autorun(function() {
    if (instance.subscriptionsReady()) {
      instance.loaded.set(instance.limit.get());
    }
  });

  instance.data.commentsCount = function() {
    return Counts.get('postCommentsListCount');
  };

  instance.comments = function() {
    return PostComments.find({ postId: data.postId },
      { limit: instance.loaded.get(), sort: { createdAt: -1 }});
  };
});

Template.postCommentsList.onDestroyed(function() {
  this.limit = null;
  this.loaded = null;
  this.data.commentsCount = null;
  this.comments = null;
});

Template.postCommentsList.onRendered(function() {
  this.frame = $('.comments-list-frame');
  this.frame.animate({ scrollTop: this.frame[0].scrollHeight }, "slow");
});

Template.postCommentsList.helpers({
  postCommentsCount: function() {
    return Template.instance().data.commentsCount();
  },

  postComments: function() {
    return Template.instance().comments();
  },

  loaded: function() {
    return Template.instance().limit.get() === Template.instance().loaded.get();
  },

  hasMore: function() {
    return (Template.instance().data.commentsCount() > Template.instance().limit.get());
  }
});

Template.postCommentsList.events({
  'click .load-more': function(e, instance) {
    e.preventDefault();
    instance.limit.set(instance.limit.get() + instance.increment);
  }
});


Template.postCommentsListItem.helpers({
  commenterPicture: function() {
    var self = this;
    //return _authorProfile(self);
  },
  commenter: function() {
    return Meteor.users.findOne(this.user._id);
  }
});
