Router.route('/accounts', {
  name: 'accountsList',
  data: function() {
    var sortBy = (this.params && this.params.query) ?
      this.params.query.sortBy : 'username';

    return {
      sortBy: sortBy
    };
  }
});

Router.route('/account/:_id', {
  name: 'accountEdit',
  data: function() {
    return {
      accountId: this.params._id
    };
  }
});
