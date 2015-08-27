Template.dashboard.onCreated(function() {
  Navigations.path.set('dashboard');

  this.subscribe('connectionsListCount');
});

Template.dashboard.helpers({
  connectionCount: function() {
    var count = Counts.get('connectionsListCount');
    return (count > 0) ? count : 0;
  }
});
