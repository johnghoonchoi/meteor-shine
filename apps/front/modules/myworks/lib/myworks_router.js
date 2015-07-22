Router.route('/myworks/drafts', {
    name: 'myWorksDrafts',
    data: function() {
      return {};
    }
});

Router.route('/myworks/public', {
  name: 'myWorksPublic'
});

Router.route('/myworks/draft/:categoryId/edit/:_id', {
  name: 'draftEdit',
  waitOn: function() {
    Meteor.subscribe('postDraftEdit', this.params._id);
  },
  data: function() {
    return {
      draftId: this.params._id
    }
  }
});
