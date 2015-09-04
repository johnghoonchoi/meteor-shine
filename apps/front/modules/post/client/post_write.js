Template.postWrite.onCreated(function() {
  var instance = this;
  var data = Template.currentData();


  instance.autoSave = new Autosave();
  instance.draftId = data.draftId;
  instance.postStatus = new ReactiveVar('');

  if(data.draftId)
    instance.postStatus.set('Draft')
  else
    instance.postStatus.set('NewPost')




  instance.autorun(function() {
    if (instance.draftId) instance.subscribe('postDraftEdit', instance.draftId);
  });

  instance.draft = function() {
    return (instance.draftId) ? PostDrafts.findOne({ _id: instance.draftId }) : null;
  };

  instance.category = function() {
    return Categories.findOne({ _id: data.categoryId, state: 'ON' });
  };



});

Template.postWrite.onDestroyed(function() {
  this.autoSave.clear();
  this.autoSave = null;
  this.draftId = null;
  this.draft = null;
  this.category = null;
});


Template.postWrite.helpers({
  postStatus: function(){
    return Template.instance().postStatus.get();
  },

  draft: function() {
    return Template.instance().draft();
  },

  titleAttrs: function() {
    return {
      'id': 'title',
      'class': 'title-editable',
      'name': 'title',
      'placeholder': '제목',
      'maxlength': 30
    };
  },

  category: function() {
    return Template.instance().category();
  },
});


Template.postWrite.events({
  'input, focus [name=content]': function(e, instance) {
    e.preventDefault();

    instance.autoSave.clear();

    instance.autoSave.set(function() {

      var categoryId = (instance.draftId && instance.draft()) ?
        instance.draft().categoryId : instance.category()._id;

      var object = {
        categoryId: categoryId,
        title: instance.$('[name=title]').val().trim(),
        content: {
          version: '0.0.1',
          type: 'markdown',
          data: instance.$('[name=content]').val()
        }
      };

      var validation = PostDraftValidator.validateInsert(object);

      if (instance.draftId) {
        if (_.isEmpty(object.title) && _.isEmpty(object.content.data)) {
          Meteor.call('postDraftRemove', instance.draftId, function (error) {
            if (!error) {
              Alerts.notify('success', 'text_draft_removed');
              instance.draftId = null;
              Router.go('postWrite', { categoryId: categoryId });
            }
          });
        }

        if (! validation.hasError() && ! _.isEmpty(object.content.data)) {
          Meteor.call('postDraftUpdate', instance.draftId, object, function(error) {
            if (error)
              Alerts.notify('error', error.reason);
            else {
              Alerts.notify('success', 'text_draft_updated');
              instance.postStatus.set('Saved');
              Meteor.setTimeout(function(){
                instance.postStatus.set('Draft');
              }, 1000);
            }

          });
        }
      } else {
        if (validation.hasError() || _.isEmpty(object.content.data)) return;

        Meteor.call('postDraftInsert', object, function(error, id) {
          if (error)
            Alerts.notify('error', error.reason);
          else {
            instance.draftId = id;
            Alerts.notify('success', 'text_draft_inserted');
            instance.postStatus.set('Saved');
            Meteor.setTimeout(function(){
              instance.postStatus.set('Draft');
            }, 1000);
          }
        });
      }
    }, 3000);
  },



  'submit #formPostWrite': function(e, instance) {
    e.preventDefault();

    instance.autoSave.clear();

    var categoryId =(instance.draftId && instance.draft()) ?
      instance.draft().categoryId : instance.category()._id;

    var object = {
      categoryId: categoryId,
      title: instance.$('[name=title]').val().trim(),
      content: {
        version: '0.0.1',
        type: 'markdown',
        data: instance.$('[name=content]').val()
      }
    };

    var validation = PostValidator.validateInsert(object);
    if (validation.hasError()) {
      Alerts.notify('error', 'error_validation_errors');
      return;
    }

    Meteor.call('postInsert', object, function(error, result) {
      if (error) {
        Alerts.notify('error', error.message);
      } else {
        if (instance.draftId) {
          Meteor.call('postDraftRemove', instance.draftId);
        }
        Alerts.notify('success', 'text_post_insert_success');
        Router.go('postView', { _id: result });


      }
    });
  }
});
