
Meteor.publish('connectionsList', function() {
  Counts.publish(this, 'connectionsListCount',
    Connection.collection.find(), { noReady: true }
  );

  return Connection.collection.find();
});


Meteor.publish('connectionsListCount', function() {
  Counts.publish(this, 'connectionsListCount',
    Connection.collection.find(), { noReady: true }
  );
});
