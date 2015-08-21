
UserStatus = new Mongo.Collection('user_status_sessions');

Template.connectionsList.onCreated(function() {
  var instance = this;

  instance.increment = 10;
  instance.limit = new ReactiveVar(instance.increment);
  instance.loadead = new ReactiveVar(0);
  instance.expand = new ReactiveVar(false);

  //instance.activeChat = null;
  //instance.chatList = [];

  //instance.hasChatId = null;
  instance.chatTemplate = null;

  instance.autorun(function() {
    var limit = instance.limit.get();
    var sort = { createdAt: -1 };

    instance.subscribe('connectionsSignInListCount');

    instance.subscribe('connectionsSignInList');

  });


  instance.connectionsCount = function() {
    return Counts.get('connectionsSignInListCount');
  };

  instance.connections = function() {
    return Connection.collection.find({ user: { $exists: true }},
      { limit: instance.loadead.get(), sort: { createdAt: -1 }});
  };

});

Template.connectionsList.onDestroyed(function() {
  this.limit = null;
  this.loadead = null;
  this.connections = null;
  //this.chatTemplate = null;
});

Template.connectionsList.helpers({
  connectionsCount: function() {
    return Template.instance().connectionsCount() - 1;
  },

  connections: function() {
    //console.log('Template.instance().connections()', Template.instance().connections());
    return Template.instance().connections();
  },

  expand: function() {
    return Template.instance().expand.get() ? "show" : "hide";
  }
});

Template.connectionsList.events({

  'click #user-status > a' : function (e, instance) {

    if (instance.chatTemplate) {
      Blaze.remove(instance.chatTemplate);
    }

    this.chatTemplate = Blaze.renderWithData(Template.chatFrame, this, document.body);
    instance.chatTemplate = this.chatTemplate;


  }
});
