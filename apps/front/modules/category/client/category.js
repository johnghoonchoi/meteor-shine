Template.categoriesList.onCreated(function() {
  var instance = this;

  instance.autorun(function() {
    instance.subscribe('categoriesList', { state: 'ON' },
      { sort: { seq: 1 }});
  });

  instance.categoriesCount = function() {
    return Counts.get('categoriesListCount');
  };

  instance.categories = function() {
    return Categories.find({ state: 'ON' }, { sort: { seq: 1 }});
  };
});

Template.categoriesList.helpers({
  categoriesCount: function() {
    return Template.instance().categoriesCount();
  },

  categories: function() {
    return Template.instance().categories();
  }
});
