Template.categoryNew.onCreated(function() {
  var instance = this;
});

Template.categoryNew.events({
  'submit #formCategoryNew': function(e, instance) {
    e.preventDefault();

    var object = {
      _id: instance.$('[name=_id]').val(),
      title: instance.$('[name=title]').val(),
      permission: {
        read: instance.$('[name=permissionRead]:checked').val(),
        write: instance.$('[name=permissionWrite]:checked').val()
      }
    };

    var validation = CategoryValidator.validateInsert(object);
    if (validation.hasError()) {
      Alerts.notify('error', 'validation_errors');
      return showValidationErrors(e, validation.errors());
    }

    Meteor.call('categoryInsert', object, function(error, result) {
      if (error) {
        Alerts.notify('error', error.reason);
      } else {
        Alerts.notify('success', 'text_category_insert_done');
        Router.go('categoriesList');
      }
    });
  }
});
