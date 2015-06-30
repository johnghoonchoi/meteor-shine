
Router.route('/posts/:category',
  function() {
    this.render('postsList', { data: { category: this.params.category }});
  },
  { name: 'postsList' }
);

Router.route('/post/:_id',
  function() { this.render('postView', { data: { postId: this.params._id }}); },
  { name: 'postView' }
);

Router.route('/postNew',
  function() { this.render('postNew'); },
  { name: 'postNew' }
);

Router.route('/post/:_id/edit',
  function() { this.render('postEdit', { data: { postId: this.params._id }}); },
  { name: 'postEdit' }
);
