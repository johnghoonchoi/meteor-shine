
Router.route('/post/:_id', {
  name: 'postView',

  waitOn: function() {
    Meteor.subscribe('releasedPostView', this.params._id);
    //Meteor.subscribe('postLikeView', this.params._id);
  },

  data: function() {
    return {
      postId: this.params._id
    };
  }
});

Router.route('/post/:categoryId/write', {
  name: 'postWrite',
  data: function() {
    return {
      categoryId: this.params.categoryId
    };
  }
});


