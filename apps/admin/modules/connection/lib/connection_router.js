Router.route('/connections',
  function() {
    var sortBy = (this.params && this.params.query) ?
      this.params.query.sortBy : 'username';

    this.render('connectionsList', {
      data: { sortBy: sortBy }
    });
  },
  { name: 'connectionsList' }
);

