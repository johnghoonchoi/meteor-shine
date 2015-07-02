Router.route('/categories',
  function() {
    this.render('categoriesList');
  },
  { name: 'categoriesList' }
);

