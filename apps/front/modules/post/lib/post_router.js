
Router.route('/post/:_id', {
  name: 'postView',
  data: function() {
    return {
      postId: this.params._id
    };
  }
});

Router.route('/category/:categoryId/newPost', {
  name: 'postWrite',
  template: 'postWrite',
  data: function() {
    return {
      categoryId: this.params.categoryId
    };
  }
});

/*
Router.route('/post/:mode/:categoryId/:_id', {
  name: 'postEdit',
  template: 'postWrite',
  data: function() {
    return {
      mode: this.params.mode,
      categoryId: this.params.categoryId,
      _id: this.params._id
    }
  }
});
*/

Router.route('/post/:_id/edit', {
  name: 'postEdit',
  data: function () {
    return {
      postId: this.params._id
    };
  }
});
