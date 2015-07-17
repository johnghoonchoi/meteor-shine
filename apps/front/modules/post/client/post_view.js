Template.postView.onCreated(function() {
  var instance = this;
  var data = Template.currentData();

  instance.editMode = new ReactiveVar(false);
  instance.setEditMode = function(edit) {
    instance.$('#title').attr('contenteditable', edit);
    instance.$('#content').attr('contenteditable', edit);
    instance.editMode.set(edit);

    if (edit) {
      instance.$('#content').wysiwyg();
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
    Meteor.subscribe('releasedPostView', data.postId);
  });

  instance.post = function() {
    return Posts.findOne(data.postId);
  };

  instance.category = function() {
    var post = instance.post();
    return (post) ? Categories.findOne(post.categoryId) : null;
  };

  instance.like = function() {
    return PostLikes.findOne({ postId: data.postId });
  };
});

Template.postView.onDestroyed(function() {
  this.editMode = null;
  this.autoSave = null;
  this.post = null;
  this.category = null;
  this.like = null;
});

Template.postView.helpers({
  titleText: function() {
    return Template.instance().data.titleText();
  },

  titleAttrs: function(editable) {
    return Template.instance().data.titleAttrs(editable);
  },

  post: function() {
    return Template.instance().post();
  },

  like: function() {
    return Template.instance().like();
  },

  isEditable: function() {
    return postAccess('update', Meteor.user(), this.postId);
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
  'click #back': function() {
    history.back(-1);
  },

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
