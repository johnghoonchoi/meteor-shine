
Router.route('/myworks', {
    name: 'myworks',
    data: function() {
      return {};
    }
});

//Router.route('/myworks/draft/:categoryId/edit/:_id', {
//  name: 'postWrite',
//  waitOn: function() {
//    Meteor.subscribe('postDraftEdit', this.params._id);
//  },
//  data: function() {
//    return {
//      draftId: this.params._id
//    }
//  }
//});
