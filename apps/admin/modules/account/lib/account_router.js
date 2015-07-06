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

Router.route('/account/:_id', {
  name: 'accountEdit',
  waitOn: function() {
    Meteor.subscribe('accountView', this.params._id);
  },
  data: function() {
    return {
      accountId: this.params._id
    };
  }
});
