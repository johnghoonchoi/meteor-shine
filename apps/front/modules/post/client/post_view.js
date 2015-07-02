Template.postView.onCreated(function() {
  var instance = this;
  var data;

  instance.increment = 5;
  instance.limit = new ReactiveVar(instance.increment);
  instance.loaded = new ReactiveVar(0);

  instance.editMode = new ReactiveVar(false);
  instance.setEditMode = function(edit) {
    instance.$('#title').attr('contenteditable', edit);
    instance.$('#content').attr('contenteditable', edit);
    instance.editMode.set(edit);

    if (edit) {
      instance.$('#content').focus();

      var post = instance.post();
      if (post && ! _.isEmpty(post.draft)) {
        instance.$('#title').html(post.draft.title);
        instance.$('#content').html(post.draft.content);
      }
    }
  };

  instance.autoSave = new Autosave();

  instance.autorun(function() {
    data = Template.currentData();

    var limit = instance.limit.get();

    instance.subscribe('postView', data.postId);

    instance.subscribe('postLikeView', data.postId);

    instance.subscribe('postCommentsList', { postId: data.postId },
      { limit: limit, sort: { createdAt: 1 }});
  });

  instance.post = function() {
    return Posts.findOne(data.postId);
  };

  instance.like = function() {
    return PostLikes.findOne({ postId: data.postId });
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
  this.limit = null;
  this.loaded = null;
  this.editMode = null;
  this.autoSave = null;
  this.post = null;
  this.commentsCount = null;
  this.comments = null;
});

Template.postView.onRendered(function() {

});

Template.postView.helpers({
  post: function() {
    return Template.instance().post();
  },

  like: function() {
    return Template.instance().like();
  },

  commentsCount: function() {
    return Template.instance().commentsCount();
  },

  comments: function() {
    return Template.instance().comments();
  },

  isEditMode: function() {
    return Template.instance().editMode.get();
  },

  titleEditable: function() {
    var post = Template.instance().post();
    var title = (post) ? post.title : '';

    return '<h3 id="title" class="title-editable" contenteditable="false">' +
      title + '</h3>';
  },

  contentEditable: function() {
    var post = Template.instance().post();
    var content = (post) ? post.content : '';

    return '<div id="content" class="content-editable" contenteditable="false">' +
      content + '</div>';
  }
});


Template.postView.events({
  'click #edit': function(e, instance) {
    instance.setEditMode(true);
  },

  'click #delete': function(e, instance) {
    e.preventDefault();

    var self = this;

    Alerts.dialog('confirm', 'delete?', function(confirm) {
      if (confirm) {
        Meteor.call('postRemove', self.postId, function(error, result) {
          if (error) {
            Alerts.notify('error', error.message);
          } else {
            Alerts.notify('success', 'post_remove_success');
            history.go(-1);
          }
        });
      }
    });
  },

  'input #content': function(e, instance) {
    e.preventDefault();

    var self = this;

    instance.autoSave.clear();
    instance.autoSave.set(function() {
      var object = {
        title: instance.$('#title').html(),
        content: instance.$('#content').html()
      };

      Meteor.call('postSaveDraft', self.postId, object, function(error) {
        if (! error) {
          Alerts.notify('success', 'draft_saved');
        }
      });
    });
  },

  'click #save': function(e, instance) {
    e.preventDefault();

    var object = {
      title: instance.$('#title').html(),
      content: instance.$('#content').html(),
    };

    if (! object.content) {
      Alerts.notify('error', 'input content');
      return;
    }

    Meteor.call('postUpdate', this.postId, object, function(error, result) {
      if (error) {
        Alerts.notify('error', error.message);
      } else {
        Alerts.notify('success', 'post_insert_success');
        instance.setEditMode(false);
      }
    });
  },

  'click #like': function(e, instance) {
    e.preventDefault();

    Meteor.call('postLikeInsert', this.postId, function(error) {
      if (error) {
        Alerts.notify('error', error.reason);
      }
    });
  },

  'click #unlike': function(e, instance) {
    e.preventDefault();

    Meteor.call('postLikeRemove', this.postId, function(error) {
      if (error) {
        Alerts.notify('error', error.reason);
      }
    });
  },

  'click .load-more': function(e, instance) {
    e.preventDefault();
    instance.limit.set(instance.limit.get() + instance.increment);
  }
});
