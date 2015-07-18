Template.postWrite.onCreated(function() {
  var instance = this;
  var data = Template.currentData();

  instance.autoSave = new Autosave();
  instance.draftId = null;

  instance.autorun(function() {
    instance.subscribe('postCategoriesList',
      { state: 'ON' }, { sort: { seq: 1 }});
  });

  instance.category = function() {
    return Categories.findOne({ _id: data.categoryId, state: 'ON' });
  };
});

Template.postWrite.onDestroyed(function() {
  this.autoSave = null;
  this.draftId = null;
  this.category = null;
});

Template.postWrite.onRendered(function() {
  this.$("[data-provide=markdown]").markdown();
  this.$("[data-provide=markdown]").tabOverride().flexText();

  //this.$('[data-provide=wyswig]').wysiwyg();
});

Template.postWrite.helpers({
  category: function() {
    return Template.instance().category();
  },

  titleAttrs: function() {
    return {
      'id': 'title',
      'class': 'title-editable',
      'contenteditable': 'true',
      'placeholder': '제목'
    };
  }
});

Template.postWrite.events({
  'click [data-handler=bootstrap-markdown-cmdUpload]': function() {
    $('input.cloudinary_fileupload').trigger('click');
    console.log('trigger: ');
  },
  'click [data-handler=bootstrap-markdown-cmdPreview]': function() {
    var $pre = $('.flex-text-wrap>pre');
    $pre.toggleClass('hidden');
  },
  'click .md-control-fullscreen': function() {
    var wrapper = $('#wrapper');
    if (! wrapper.hasClass('aside-right-set'))
      wrapper.addClass('aside-left-set');
  },

  'input [data-provide]': function(e, instance) {
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
          data: $contents.val()
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
        categoryId: instance.category()._id,
        title: instance.$('#title').html(),
        content: content
      };

      if (! instance.draftId) {
        if (_.isEmpty(object.content)) {
          return;
        }

        Meteor.call('postDraftInsert', object, function(error, id) {
          if (error) {
            Alerts.notify('error', error.reason);
          } else {
            instance.draftId = id;
            Alerts.notify('success', 'draft_inserted');
          }
        });
      } else {
        if (! _.isEmpty(object.content)) {
          Meteor.call('postDraftUpdate', instance.draftId, object, function(error) {
            if (error) {
              Alerts.notify('error', error.reason);
            } else {
              Alerts.notify('success', 'draft_saved');
            }
          });
        } else {
          Meteor.call('postDraftRemove', instance.draftId, function(error) {
            if (! error) {
              Alerts.notify('success', 'draft_removed');
              instance.draftId = null;
            }
          });
        }
      }
    });
  },

  'submit #formPostWrite': function(e, instance) {
    e.preventDefault();

    console.log('submit: ');


    instance.autoSave.clear();

    var $contents = instance.$('[data-provide]');
    var dataType = $contents.attr('data-provide');
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
      categoryId: instance.category()._id,
      title: instance.$('#title').text().trim(),
      content: content
    };

    Meteor.call('postInsert', object, function(error, result) {
      if (error) {
        Alerts.notify('error', error.message);
      } else {
        if (instance.draftId) {
          Meteor.call('postDraftRemove', instance.draftId, function() {
            console.log('draft removed...');
          });
        }
        Alerts.notify('success', 'post_insert_success');
        Router.go('postView', { _id: result });
      }
    });
  }
});
