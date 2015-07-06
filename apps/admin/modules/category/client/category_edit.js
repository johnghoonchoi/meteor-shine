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

  categoryRoles: function(action) {
    var id = Template.currentData().categoryId;
    return [
      'PUBLIC',
      'ROLE_USER',
      'ROLE_CATEGORY_' + action.toUpperCase() + '_' + id.toUpperCase()
    ];
  }
});
