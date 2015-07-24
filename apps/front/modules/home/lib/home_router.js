//HomeController = RouteController.extend({
//  template: 'home',
//
//  action: function() {
//    this.render();
//  }
//});


Router.route('/home', {
  name: 'home',
  data: function() {
    return {
      sortBy: (this.params.query) ? this.params.query.sortBy : ''
    };
  }
});
