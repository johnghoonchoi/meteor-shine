Router.route('/accounts', {
  name: 'accountsList'
});

Router.route('/account/:_id', {
  name: 'accountEdit',
  data: function() {
    return {
      accountId: this.params._id
    };
  }
});
