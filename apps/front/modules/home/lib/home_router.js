HomeController = RouteController.extend({
  template: 'home',

  action: function() {
    this.render();
  }
});


Router.route('/home', {
  name: 'home',
  controller: 'HomeController'
});
