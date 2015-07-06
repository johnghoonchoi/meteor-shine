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
    var permission = Template.instance().permission;
    return (permission && permission.read === value) ? "checked": "";
  },

  isPermissionWrite: function(value) {
    var permission = Template.instance().permission;
    return (permission && permission.write === value) ? "checked": "";
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
  'submit #formCategoryEdit': function(e, instance) {
    e.preventDefault();

    var object = {
      title: instance.$('[name=title]').val(),
      state: instance.$('[name=state]:checked').val(),
      permission: {
        read: instance.$('[name=permisionRead]:checked').val(),
        write: instance.$('[name=permisionWrite]:checked').val()
      }
    };

    Meteor.call('categoryEdit', this.categoryId, object, function(error, result) {
      if (error) {
        Alerts.notify('error', error.reason);
      } else {

      }
    });
  }
});
