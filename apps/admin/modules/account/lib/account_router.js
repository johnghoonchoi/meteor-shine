Router.route('/accounts',
  function() {
    var sortBy = (this.params && this.params.query) ?
      this.params.query.sortBy : 'username';

    this.render('accountsList', {
      data: { sortBy: sortBy }
    });
  },
  { name: 'accountsList' }
);

