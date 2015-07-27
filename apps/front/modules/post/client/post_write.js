Template.postWrite.onCreated(function() {
  var instance = this;
  var data = Template.currentData();

  instance.draftId = data.draftId;

  instance.state = new ReactiveDict;
  instance.autoSave = new Autosave();

  instance.state.set('update', 0);

  instance.autorun(function() {
    if (instance.draftId) {
      instance.subscribe('postDraftEdit', instance.draftId);
    }
  });

  instance.category = function() {
    return Categories.findOne({ _id: data.categoryId, state: 'ON' });
  };

  instance.draft = function() {
    return (data.draftId) ? PostDrafts.findOne({ _id: data.draftId }) : null;
  };
});

Template.postWrite.onDestroyed(function() {
  this.autoSave.clear();
  this.autoSave = null;

  this.draftId = null;
  this.category = null;
});


Template.postWrite.helpers({
  draft: function() {
    return Template.instance().draft();
  },

  titleAttrs: function(maxLeng) {
    return {
      'id': 'title',
      'class': 'title-editable',
      'name': 'title',
      'placeholder': '제목',
      'maxlength': maxLeng
    };
  },

  titleMax: function() {
    return 20;
  },

  category: function() {
    return Template.instance().category();
  }
});


Template.postWrite.events({
  'input, focus [name=title]': function(e, t) {
    //var count = $(e.currentTarget).val().trim().length;
    //t.data.titleCount.set(count);
  },


  // todo : 20, July, draft functionality here..
  'input [data-provide], input [name=title]': function(e, instance) {
    e.preventDefault();

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

      var cateId;
      if (instance.data.categoryId) cateId = instance.data.categoryId;
      else cateId = instance.category()._id;

      var object = {
        categoryId: cateId,
        title: instance.$('[name=title]').val().trim(),
        content: content
      };

      if (instance.draftId) {
        if (! _.isEmpty(object.content.data)) {
          Meteor.call('postDraftUpdate', instance.draftId, object, function(error) {
            if (error) {
              Alerts.notify('error', error.reason);
            } else {
              BothLog.log('드래프트 업데이트 성공..');

              Alerts.notify('success', 'draft_updated');
            }
          });
        } else {
          Meteor.call('postDraftRemove', instance.draftId, function(error) {
            if (! error) {
              Alerts.notify('success', 'draft_removed');
              instance.draftId = null;
              BothLog.log('드래프트 제거 성공..');
            }
          });
        }
      } else if (instance.postId) {
        if (_.isEmpty(object.content.data)) {
          return;
        }

        Meteor.call('postSaveDraft', instance.postId, object, function(error) {
          if (! error) {
            Alerts.notify('success', 'post_draft_saved');
          }
        });
      } else {
        if (_.isEmpty(object.content.data)) {
          return;
        }

        Meteor.call('postDraftInsert', object, function(error, id) {
          if (error) {
            Alerts.notify('error', error.reason);
          } else {
            instance.draftId = id;
            Alerts.notify('success', 'draft_inserted');
            BothLog.log('드래프트 인서트 성공..');
            instance.autoSave.clear();
          }
        });
      }

      //if (! instance.draftId) {
      //  if (_.isEmpty(object.content.data)) {
      //    return;
      //  }
      //
      //  Meteor.call('postDraftInsert', object, function(error, id) {
      //    if (error) {
      //      Alerts.notify('error', error.reason);
      //    } else {
      //      instance.draftId = id;
      //      Alerts.notify('success', 'draft_inserted');
      //      BothLog.log('드래프트 인서트 성공..');
      //      instance.autoSave.clear();
      //    }
      //  });
      //} else {
      //  if (! _.isEmpty(object.content.data)) {
      //    Meteor.call('postDraftUpdate', instance.draftId, object, function(error) {
      //      if (error) {
      //        Alerts.notify('error', error.reason);
      //      } else {
      //        BothLog.log('드래프트 업데이트 성공..');
      //
      //        Alerts.notify('success', 'draft_updated');
      //      }
      //    });
      //  } else {
      //    Meteor.call('postDraftRemove', instance.draftId, function(error) {
      //      if (! error) {
      //        Alerts.notify('success', 'draft_removed');
      //        instance.draftId = null;
      //        BothLog.log('드래프트 제거 성공..');
      //      }
      //    });
      //  }
      //}
    }, 4000);
  },

  'submit #formPostWrite': function(e, instance) {
    e.preventDefault();

    instance.autoSave.clear();

    var $contents = instance.$('[data-provide]');
    var dataType = $contents.attr('data-provide');
    var content;
    var titleLength = $('[name=title]').val().trim().length;
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

    var cateId;
    if (instance.data.categoryId) cateId = instance.data.categoryId;
    else cateId = instance.category()._id;

    var object = {
      categoryId: cateId,
      title: instance.$('[name=title]').val().trim(),
      content: content
    };

    if (instance.postId) {
      Meteor.call('postUpdate', this.postId, object, function(error, result) {
        if (error) {
          Alerts.notify('error', error.message);
        } else {
          Alerts.notify('success', 'post_update_success');
          instance.setEditMode(false);
          history.go(-1);
        }
      });
    } else {
      Meteor.call('postInsert', object, function(error, result) {
        if (error) {
          Alerts.notify('error', error.message);
        } else {
          if (instance.draftId) {
            Meteor.call('postDraftRemove', instance.draftId, function() {
              BothLog.log('draft removed...');

            });
          }
          Alerts.notify('success', 'post_insert_success');
          Router.go('postView', { _id: result });
        }
      });
    }

  }
});
