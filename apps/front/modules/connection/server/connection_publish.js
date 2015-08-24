/**
 * return user list except me
 */
Meteor.publishComposite('connectionsSignInList', function(options) {
  check(options, Match.ObjectIncluding({
    "limit": Number,
    "sort": Match.ObjectIncluding({
      "createdAt": Match.Optional(Number),
    })
  }));

  if (! this.userId)
    return [];

  var query = { user: { $exists: true }, 'user._id': { $ne: this.userId }};

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
  };
});

Meteor.publish('connectionsSignInListCount', function() {
  var query = { user: { $exists: true }, 'user._id': { $ne: this.userId }};

  Counts.publish(this, 'connectionsSignInListCount',
    Connection.collection.find(query));
});
