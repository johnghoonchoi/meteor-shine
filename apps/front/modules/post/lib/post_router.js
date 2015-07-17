
Router.route('/post/:_id', {
  name: 'postView',
/*
  waitOn: function() {
    Meteor.subscribe('postView', this.params._id);
    Meteor.subscribe('postLikeView', this.params._id);
  },
*/
  data: function() {
    return {
      postId: this.params._id
    };
  }
});

Router.route('/post/:categoryId/new', {
  name: 'postNew',
  waitOn: function() {
    Meteor.subscribe('categoryView', this.params.categoryId,
      { sort: { seq: 1 }});
  },

  data: function() {
    return {
      categoryId: this.params.categoryId
    };
  }
});
