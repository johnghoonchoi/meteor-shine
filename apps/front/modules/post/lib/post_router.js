
Router.route('/posts/:category',
  function() {
    var sortBy = (this.params && this.params.query) ?
      this.params.query.sortBy : 'time';

    this.render('postsList', {
      data: { category: this.params.category, sortBy: sortBy }
    });
  },
  { name: 'postsList' }
);

Router.route('/post/:_id', { name: 'postView',
  waitOn: function() {
    Meteor.subscribe('postView', this.params._id);
    Meteor.subscribe('postLikeView', this.params._id);
  },

  data: function() {
    return {
      postId: this.params._id
    };
  }
});

Router.route('/postNew', {
  name: 'postNew',
  waitOn: function() {
    Meteor.subscribe('postCategoriesList', { state: 'ON' },
      { sort: { seq: 1 }});
  }
});
