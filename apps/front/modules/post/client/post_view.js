Template.postView.onCreated(function() {
  var instance = this;
  var data = Template.currentData();

  instance.increment = 5;
  instance.limit = new ReactiveVar(instance.increment);
  instance.loaded = new ReactiveVar(0);

  instance.autorun(function() {
    var limit = instance.limit.get();

    instance.subscribe('postView', data.postId);

    instance.subscribe('postCommentsListCount', { postId: data.postId },
      { limit: limit, sort: { createdAt: 1 }});

    instance.subscribe('postCommentsList', data.postId);
  });

  instance.post = function() {
    return Posts.findOne(data.postId);
  };

  instance.commentsCount = function() {
    return Counts.get('postCommentsListCount', { postId: data.postId });
  };

  instance.comments = function() {
    return PostComments.find({ postId: data.postId },
      { limit: instance.loaded.get(), sort: { createdAt: 1 }});
  };
});

Template.postView.onDestroyed(function() {
  this.post = null;
});

Template.postView.helpers({
  post: function() {
    return Template.instance().post();
  },

  commentsCount: function() {
    return Template.instance().commentsCount();
  },

  comments: function() {
    return Template.instance().comments();
  }
});

Template.postView.events({
  'click .load-more': function(e, instance) {
    e.preventDefault();
    instance.limit.set(instance.limit.get() + instance.increment);
  }
});
