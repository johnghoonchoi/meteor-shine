Template.categoryView.onCreated(function() {
  var instance = this;
  var data = Template.currentData();

  instance.category = function() {
    return Categories.findOne(data.categoryId);
  };
});

Template.categoryView.onDestroyed(function() {
  this.category = null;
});

Template.categoryView.helpers({
  category: function() {
    return Template.instance().category();
  }
});
