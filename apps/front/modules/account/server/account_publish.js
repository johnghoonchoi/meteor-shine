//Meteor.publish("userData", function () {
//  if (this.userId) {
//    return Meteor.users.find({_id: this.userId},
//      {fields: {'username': 1, 'profile': 1, 'services': 1}});
//  } else {
//    this.ready();
//  }
//});

Meteor.publish("accountData", function (filter) {
  var self = this,
      ready = false;

  var subHandle = Meteor.users.find(filter || {}).observeChanges({
    added: function (id, fields) {
      if (! ready)
        if (fields.services && fields.services.facebook) {
          fields.facebook = {};
          fields.facebook.name = fields.services.facebook.name;
          fields.facebook.id = fields.services.facebook.id;
          delete fields.services;
        }
      self.added("users", id, fields);
      console.log(" added.. ");
    },
    changed: function (id, fields) {
      self.changed("users", id, fields);
      console.log(" changed.. ");
    },
    removed: function (id) {
      self.removed("users", id);
    }
  });

  self.ready();

  ready = true;

  self.onStop(function() {
    subHandle.stop();
  });
});

