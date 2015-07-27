
Template.postEdit.onCreated(function() {
  var instance = this;
  var data = Template.currentData();

  instance.autoSave = new Autosave();

  instance.autorun(function() {
    Meteor.subscribe('releasedPostView', data.postId);
  });

  // lazy update
  instance.autorun(function() {
    var post = Posts.findOne(data.postId);
    if (post && ! postAccess('update', Meteor.user(), data.postId)) {
      Alerts.notify('error', 'error_access_denied');
    }
  });

  instance.post = function() {
    return Posts.findOne({ _id: data.postId, state: 'PUBLISHED' });
  };

  instance.category = function(categoryId) {
    return Categories.findOne({ _id: categoryId });
  };
});

Template.postEdit.onDestroyed(function() {
  this.autoSave.clear();
  this.autoSave = null;
  this.post = null;
  this.category = null;
});

Template.postEdit.helpers({
  category: function() {
    var post = Template.instance().post();
    return (post) ? Template.instance().category(post.categoryId) : null;
  },

  title: function() {
    var post = Template.instance().post();
    return (post) ? post.title : '';
  },

  content: function() {
    var post = Template.instance().post();
    return (post && post.content) ? post.content.data : '';
  }
});

Template.postEdit.events({
  'input [name=content]': function(e, instance) {

    instance.autoSave.clear();

    instance.autoSave.set(function() {
      var object = {
        title: instance.$('[name=title]').val().trim(),
        content: {
          version: '0.0.1',
          type: 'markdown',
          data: instance.$('[name=content]').val()
        }
      };

      var validation = PostValidator.validateUpdate(object);
      if (validation.hasError()) {
        Alerts.notify('error', 'validation_errors');
        return;
      }

      Meteor.call('postSaveDraft', instance.data.postId, object, function(error) {
        if (error) {
          Alerts.notify('error', error.message);
        } else {
          Alerts.notify('success', 'text_post_draft_success');
        }
      });
    });

  },

  'submit #formPostEdit': function(e, instance) {
    e.preventDefault();

    var self = this;

    instance.autoSave.clear();

    var object = {
      title: instance.$('[name=title]').val().trim(),
      content: {
        version: '0.0.1',
        type: 'markdown',
        data: instance.$('[name=content]').val()
      }
    };

    var validation = PostValidator.validateUpdate(object);
    if (validation.hasError()) {
      Alerts.notify('error', 'validation_errors');
      return; // showValidationErrors(e, validation.errors());
    }

    Meteor.call('postUpdate', self.postId, object, function(error) {
      if (error) {
        Alerts.notify('error', error.message);
      } else {
        Alerts.notify('success', 'text_post_update_success');
        Router.go('postView', { _id: self.postId });
      }
    });
  }
});
