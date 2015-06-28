Template.blogCommentNew.helpers({
  editable: function() {
    return '<div class="editable form-control" contenteditable="true" name="msg"></div>';
  }

});

Template.blogCommentNew.events({
  'submit #formBlogCommentNew': function(e) {
    e.preventDefault();

    var object = {
      blogId: this.blogId,
      msg: $(e.target).find('[name=msg]').html().trim()
    };

    Meteor.call('blogCommentInsert', object, function(error) {
      if (error) {
        Alerts.notify('error', error.reason);
      } else {
        $(e.target).find('[name=msg]').html('');

        var frame = $('.comments-list-frame');
        frame.animate({ scrollTop: frame[0].scrollHeight }, "slow");
      }
    });
  }
});



Template.blogCommentsList.onCreated(function() {
  var instance = this;
  var data = Template.currentData();

  instance.increment = 5;
  instance.limit = new ReactiveVar(instance.increment);
  instance.loaded = new ReactiveVar(0);

  instance.autorun(function() {
    var limit = instance.limit.get();

    instance.subscribe('blogCommentsListCount',
      { blogId: data.blogId });
    instance.subscribe('blogCommentsList',
      { blogId: data.blogId }, { limit: limit, sort: { createdAt: -1 }},
      function() { instance.loaded.set(limit); });
  });

  instance.commentsCount = function() {
    return Counts.get('blogCommentsCount');
  };

  instance.comments = function() {
    return BlogComments.find({ blogId: data.blogId },
      { limit: instance.loaded.get(), sort: { createdAt: 1 }});
  };
});

Template.blogCommentsList.onDestroyed(function() {
  this.limit = null;
  this.comments = null;
});

Template.blogCommentsList.onRendered(function() {
  this.frame = $('.comments-list-frame');
  this.frame.animate({ scrollTop: this.frame[0].scrollHeight }, "slow");
});

Template.blogCommentsList.helpers({
  blogCommentsCount: function() {
    return Template.instance().commentsCount();
  },

  blogComments: function() {
    return Template.instance().comments();
  },

  loaded: function() {
    return Template.instance().limit.get() === Template.instance().loaded.get();
  },

  hasMore: function() {
    return (Template.instance().commentsCount() > Template.instance().limit.get());
  }
});

Template.blogCommentsList.events({
  'click .load-more': function(e, instance) {
    e.preventDefault();
    instance.limit.set(instance.limit.get() + instance.increment);
  }
});


Template.blogCommentsListItem.helpers({
  commenterPicture: function() {
    var self = this;
    //return _authorProfile(self);
  },
  commenter: function() {
    return Meteor.users.findOne(this.user._id);
  }
});
