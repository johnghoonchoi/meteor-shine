Template.postView.onCreated(function() {
  var instance = this;
  var data = Template.currentData();

  instance.isEditable = new ReactiveVar(false);

  instance.autoSave = new Autosave();

  instance.autorun(function() {
    Meteor.subscribe('releasedPostView', data.postId);
  });

  // lazy update
  instance.autorun(function() {
    var post = Posts.findOne(data.postId);
    if (post) {
      instance.isEditable.set(postAccess('update', Meteor.user(), data.postId));
    }
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
  this.autoSave.clear(); /* Clear setTimeout of Autosave instance  */
  this.editMode = null;
  this.autoSave = null;
  this.post = null;
  this.category = null;
  this.like = null;
});

Template.postView.helpers({
  titleText: function() {
    var post = Template.instance().post();
    var title = (post) ? post.title : '';
    return title;
  },

  titleAttrs: function(editable) {
    var attrs = {
      id: "title",
      class: "title-editable",
      contenteditable: editable
    };

    return attrs;
  },

  category: function() {
    return Template.instance().category();
  },

  post: function() {
    return Template.instance().post();
  },

  like: function() {
    return Template.instance().like();
  },

  isEditable: function() {
    return Template.instance().isEditable.get();
  }
});


Template.postView.events({
  'click #back': function(e, instance) {
    history.back(-1);
  },

  'click [data-role=delete]': function(e, instance) {
    e.preventDefault();

    var self = this;

    Alerts.dialog('confirm', '정말 삭제하시겠습니까?', function(confirm) {
      if (confirm) {
        Meteor.call('postRemove', self.postId, function(error, result) {
          if (error) {
            Alerts.notify('error', error.message);
          } else {
            BothLog.log('one post successfully removed..');
            Alerts.notify('success', 'post_remove_success');
            history.go(-1);
          }
        });
      }
    });
  },

  'input [data-provide]': function(e, instance) {
    e.preventDefault();
    var self = this;

    instance.autoSave.clear();
    instance.autoSave.set(function() {

      var $contents = instance.$('[data-provide]');
      var dataType = $contents.attr('data-provide');

      var content;
      if (dataType === 'markdown') {
        content = {
          type: dataType,
          version: '0.0.1',
          data: $contents.val().trim()
        };
      } else if (dataType === 'wyswig') {
        content = {
          type: dataType,
          version: '0.0.1',
          data: $contents.html()
        };
      } else {
        Alerts.notify('error', 'error_invalid_input');

        return;
      }

      var object = {
        categoryId: instance.post().categoryId,
        title: instance.$('#title').html(),
        content: content
      };

      Meteor.call('postSaveDraft', self.postId, object, function(error) {
        if (! error) {
          Alerts.notify('success', 'post_draft_saved');
        }
      });
    }, 3000);
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
  }
});


Template.postViewContent.helpers({
  isMarkdown: function() {
    return (this.type === 'markdown');
  }
});
