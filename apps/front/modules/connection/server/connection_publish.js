/*
Meteor.publish('connectionsList', function() {

  Counts.publish(this, 'connectionsListCount',
    Connection.collection.find(), { noReady: true }
  );

  return Connection.collection.find();
});
*/
Meteor.publishComposite('connectionsSignInList', function() {
  if (! this.userId)
    return [];

  var query = {
    user: { $exists: true },
    'user._id': { $ne: this.userId }
  };

  var options = {
    sort: { createdAt: -1 }
  };

  return {
    find: function() {
      return Connection.collection.find(query, options);
    },

    children: [
      {
        find: function(connection) {
          return Meteor.users.find({ _id: connection.user._id });
        }
      }
    ]
  }
});

Meteor.publish('connectionsSignInListCount', function() {
  Counts.publish(this, 'connectionsSignInListCount',
    Connection.collection.find({ user: { $exists: true }}));
});
