Router.route('/categories',
  function() {
    this.render('categoriesList');
  },
  { name: 'categoriesList' }
);

Router.route('/category/:_id', {
  name: 'categoryEdit',

  waitOn: function() {
    Meteor.subscribe('categoryView', this.params._id);
  },

  data: function() {
    return {
      categoryId: this.params._id
    };
  }
});

Router.route('/categoryNew', {
  name: 'categoryNew'
});
