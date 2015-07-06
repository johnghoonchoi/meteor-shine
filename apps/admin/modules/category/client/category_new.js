Template.categoryNew.onCreated(function() {
  var instance = this;
});

Template.categoryNew.events({
  'submit #formCategoryNew': function(e, instance) {
    e.preventDefault();

  }
});
