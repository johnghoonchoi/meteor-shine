Template.categoryEdit.onCreated(function() {
  var instance = this;
  var data = Template.currentData();

  instance.category = function() {
    return Categories.findOne(data.categoryId);
  };
});

Template.categoryEdit.onDestroyed(function() {
  this.category = null;
});

Template.categoryEdit.helpers({
  category: function() {
    return Template.instance().category();
  },

  isState: function(state) {
    return (state === Template.instance().category().state) ? "checked": "";
  },

  isPermissionRead: function(value) {
    var category = Template.instance().category();
    return (category.permission && category.permission.read === value) ?
      "checked" : "";
  },

  isPermissionWrite: function(value) {
    var category = Template.instance().category();
    return (category.permission && category.permission.write === value) ?
      "checked" : "";
  },

  categoryRoles: function(action) {
    var id = Template.currentData().categoryId;
    return [
      'PUBLIC',
      'ROLE_USER',
      'ROLE_CATEGORY_' + action.toUpperCase() + '_' + id.toUpperCase()
    ];
  }
});

Template.categoryEdit.events({
  'click #cancel': function(e) {
    e.preventDefault();

    history.back(-1);
  },

  'submit #formCategoryEdit': function(e, instance) {
    e.preventDefault();

    var object = {
      title: instance.$('[name=title]').val(),
      state: instance.$('[name=state]:checked').val(),
      permission: {
        read: instance.$('[name=permissionRead]:checked').val(),
        write: instance.$('[name=permissionWrite]:checked').val()
      }
    };

    var validation = CategoryValidator.validateUpdate(object);
    if (validation.hasError()) {
      Alerts.notify('error', 'validation_errors');
      return showValidationErrors(e, validation.errors());
    }

    Meteor.call('categoryUpdate', this.categoryId, object, function(error, result) {
      if (error) {
        Alerts.notify('error', error.reason);
      } else {
        Alerts.notify('success', 'text_category_update_done');
      }
    });

  }
});
