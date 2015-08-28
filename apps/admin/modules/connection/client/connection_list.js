
UserStatus = new Mongo.Collection('user_status_sessions');

Template.connectionsList.onCreated(function() {
  Navigations.path.set('connectionsList');

  var instance = this;

  instance.increment = 10;
  instance.limit = new ReactiveVar(instance.increment);
  instance.loaded = new ReactiveVar(0);

  instance.autorun(function() {
    var limit = instance.limit.get();
    var sort = { createdAt: -1 };

    instance.subscribe('connectionsList',
      { limit: limit, sort: sort },
      function() { instance.loaded.set(limit); }
    );
  });

  instance.connections = function() {
    return Connection.collection.find({},
      { limit: instance.loaded.get(), sort: { createdAt: -1 }});
  };

});

Template.connectionsList.onDestroyed(function() {
  this.limit = null;
  this.loaded = null;
  this.connections = null;
});


Template.connectionsList.helpers({
  connectionsCount: function() {
    var count = Counts.get('connectionsListCount');
    return (count > 0) ? count : 0;
  },

  connections: function() {
    return Template.instance().connections();
  }
});
