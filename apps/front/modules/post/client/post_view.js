Template.postView.onCreated(function() {
  var instance = this;
  var data = Template.currentData();

  instance.editMode = new ReactiveVar(false);

  instance.setEditMode = function(edit) {
    instance.$('#title').attr('contenteditable', edit);

    if (edit) {
      instance.$('[data-provide]').attr('data-provide','markdown-editable');
      instance.$('[data-provide]').trigger('click');

      var post = instance.post();
      if (post && ! _.isEmpty(post.draft)) {
        instance.$('#title').html(post.draft.title);
        instance.$('[data-provide]').val(post.draft.content.data);
      }
    } else {
      instance.$('.md-editor').remove();
      // todo : 포스트 수정 후 바로 뷰 페이지가 보이는 부분부터 해야함
    }

    instance.editMode.set(edit);
  };

  instance.insertContent = function() {
    var post = this.post();

    var $contentWrap = $('[data-provide]');
    var content = post ? post.content : '';

    if (content.type === 'markdown') {
      $contentWrap.append(marked(content.data));
    } else if (content.type === 'wyswig') {
      $contentWrap.append(content.data);
    } else {
      Alerts.notify('error', 'error_invalid_content');
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

Template.postView.onRendered(function() {
  this.insertContent();
  //console.log('user: ', Meteor.user());
  //console.log('post: ', this.data.postId);

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

  post: function() {
    return Template.instance().post();
  },

  like: function() {
    return Template.instance().like();
  },

  isEditable: function() {
    var user = Meteor.user();
    var postId = Template.instance().data.postId;

    // todo : 포스트 삭제 후 이 헬퍼 함수가 다시 작동해서 throw error..
    return postAccess('update', user, postId);
  },

  isEditMode: function() {
    return Template.instance().editMode.get();
  }
});


Template.postView.events({
  'click #back': function() {
    history.back(-1);
  },

  'click [data-role=edit]': function(e, instance) {
    instance.setEditMode(true);
  },

  'click [data-role=delete]': function(e, instance) {
    e.preventDefault();
    var self = this;

    console.log('self.postId: ', self.postId);

    Alerts.dialog('confirm', '정말 삭제하시겠습니까?', function(confirm) {
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

  'click [data-role=save]': function(e, instance) {
    e.preventDefault();
    var $contents = instance.$('textarea');
    var dataType = instance.post().content.type;
    var content;
    var titleLength = $('#title').text().trim().length;
    var contentLength;

    if (dataType === 'markdown') {
      content = {
        type: dataType,
        version: '0.0.1',
        data: $contents.val()
      };
      contentLength = content.data.trim().length;
    } else if (dataType === 'wyswig') {
      content = {
        type: dataType,
        version: '0.0.1',
        data: $contents.html()
      };
      contentLength = $contents.text().trim().length;
    } else {
      Alerts.notify('error', 'error_invalid_input');
      return;
    }

    if(! titleLength) {
      Alerts.notify('error', '제목을 입력해주세요.');
      return;
    } else if (titleLength < 3) {
      Alerts.notify('error', '3자 이상 입력하세요.');
      return;
    }

    if (! contentLength) {
      Alerts.notify('error', '내용을 입력해주세요.');
      return;
    } else if (contentLength < 3) {
      Alerts.notify('error', '3자 이상 입력하세요.');
      return;
    }

    var object = {
      title: instance.$('#title').text().trim(),
      content: content
    };

    Meteor.call('postUpdate', this.postId, object, function(error, result) {
      if (error) {
        Alerts.notify('error', error.message);
      } else {
        Alerts.notify('success', 'post_update_success');
        instance.setEditMode(false);
        history.go(-1);
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
