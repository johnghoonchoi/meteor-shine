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
  this.autoSave.clear();
  this.autoSave = null;
  this.post = null;
  this.category = null;
  this.like = null;
});

Template.postView.helpers({
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
  'click #back': function() {
    history.back(-1);
  },

  'click #remove': function(e) {
    e.preventDefault();

    var self = this;

    Alerts.dialog('confirm', '정말 삭제하시겠습니까?', function(confirm) {
      if (confirm) {
        Meteor.call('postRemove', self.postId, function(error) {
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

  'click #like': function(e) {
    e.preventDefault();

    Meteor.call('postLikeInsert', this.postId, function(error) {
      if (error) {
        Alerts.notify('error', error.reason);
      }
    });
  },

  'click #unlike': function(e) {
    e.preventDefault();

    Meteor.call('postLikeRemove', this.postId, function(error) {
      if (error) {
        Alerts.notify('error', error.reason);
      }
    });
  }
});
