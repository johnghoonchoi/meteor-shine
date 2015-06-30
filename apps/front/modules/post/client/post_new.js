Template.postNew.onCreated(function() {
  var instance = this;

  instance.autorun(function() {
    instance.subscribe('postCategoriesList', { state: 'ON' },
      { sort: { seq: 1 }});
  });

  instance.categoriesCount = function() {
    Counts.get('postCategoriesListCount');
  };

  instance.categories = function() {
    return PostCategories.find({ state: 'ON' }, { sort: { seq: 1 }});
  };
});

Template.postNew.onDestroyed(function() {
  this.categoriesCount = null;
  this.categories = null;
});

Template.postNew.helpers({
  categoriesCount: function() {
    return Template.instance().categoriesCount();
  },

  categories: function() {
    return Template.instance().categories();
  },

  contentEditable: function() {
    return '<div class="editable form-control" contenteditable="true" name="content"></div>';
  }
});

Template.postNew.events({
  'submit #formPostNew': function(e) {
    e.preventDefault();

    var object = {
      category: $(e.target).find('[name=category]').val(),
      title: $(e.target).find('[name=title]').val(),
      content: $(e.target).find('[name=content]').html(),
    };

    Meteor.call('postInsert', object, function(error, result) {
      if (error) {
        Alerts.notify('error', error.message);
      } else {
        Alerts.notify('success', 'post_insert_success');
        Router.go('postView');
      }
    });
  }
});
