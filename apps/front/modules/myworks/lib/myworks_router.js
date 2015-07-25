
Router.route('/myworks', {
    name: 'myworks',
    data: function() {
      return {};
    }
});

Router.route('/:mode/:categoryId/:_id/', {
  name: 'draftWrite',
  template: 'postWrite',
  data: function() {
    return {
      mode: this.params.mode,
      categoryId: this.params.categoryId,
      _id: this.params._id
    };
  }
});
