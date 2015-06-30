HomeController = RouteController.extend({
  //increment: 10,
  //limit: function() {
  //  return parseInt(this.params.query.r) || this.increment;
  //},
  //nextPath: function() {
  //  this.params.query.r = this.limit() + this.increment;
  //  return this.route.path({}, { query: this.params.query });
  //},
  //
  //findQuery: function() {
  //  return {}
  //},
  //findOptions: function() {
  //  return { limit: this.limit(), sort: { createdAt: -1 }}
  //},
  //
  //blogs: function() {
  //  return Blogs.find(this.findQuery(), this.findOptions());
  //},
  //
  //subscriptions: function() {
  //  this.subs = Meteor.subscribe('blogsList', this.findQuery(), this.findOptions());
  //},
  //
  //data: function() {
  //  return {
  //    ready: this.subs.ready,
  //    hasMore: this.blogs().count() === this.limit(),
  //    blogs: this.blogs()
  //  };
  //}

});


Router.route('/home', function() {
  this.render('home');
}, { name: 'home'});
