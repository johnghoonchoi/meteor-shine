
UserStatus = new Mongo.Collection('user_status_sessions');

Template.connectionsList.onCreated(function() {
  var instance = this;

  instance.increment = 10;
  instance.limit = new ReactiveVar(instance.increment);
  instance.loadead = new ReactiveVar(0);

  instance.autorun(function() {
    var limit = instance.limit.get();
    var sort = { createdAt: -1 };

    instance.subscribe('connectionsList', { limit: limit, sort: sort });
  });


  instance.connectionsCount = function() {
    return Counts.get('connectionsListCount');
  };

  instance.connections = function() {
    return Connection.collection.find({},
      { limit: instance.loadead.get(), sort: { createdAt: -1 }});
  };

});

Template.connectionsList.onDestroyed(function() {
  this.limit = null;
  this.loadead = null;
  this.connections = null;
});


Template.connectionsList.helpers({
  connectionsCount: function() {
    return Template.instance().connectionsCount();
  },

  connections: function() {
    return Template.instance().connections();
  }
});
