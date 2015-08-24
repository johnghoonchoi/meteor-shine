
Router.route('/posts', {
  name: 'postsList',
  data: function() {
    return {
      sortBy: (this.params && this.params.query) ? this.params.query.sortBy : ''
    };
  }
});

Router.route('/post/:_id', {
  name: 'postView',
  data: function() {
    return {
      postId: this.params._id
    };
  }
});

Router.route('/postWrite', {
  name: 'postWrite',
  waitOn: function() {
    Meteor.subscribe('postCategoriesList', { state: 'ON' },
      { sort: { seq: 1 }});
  }
});
