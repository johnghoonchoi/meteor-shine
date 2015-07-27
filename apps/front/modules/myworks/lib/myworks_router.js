
Router.route('/myworks/:mode', {
    name: 'myworks',
    data: function() {
      return {
        mode: this.params.mode
      };
    }
});

/*
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
*/
