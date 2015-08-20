Template.dashboard.onCreated(function() {
  var instance = this;

  Navigations.path.set('dashboard');

  instance.autorun(function() {
    instance.subscribe('connectionsList');
  });
});

Template.dashboard.helpers({
  connectionCount: function() {
    var count = Counts.get('connectionsListCount');
    return (count > 0) ? count : 0;
  }
});
