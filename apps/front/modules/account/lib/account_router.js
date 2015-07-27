Router.route('/user/:username', {
  name: 'accountView',
  data: function() {
    return {
      username: this.params.username,
      sortBy: (this.params.query) ? this.params.query.sortBy : ''
    };
  }
});
