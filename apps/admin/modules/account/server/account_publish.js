Meteor.publish('accountsList', function(options) {
  check(options, Match.ObjectIncluding({
    "limit": Match.Optional(Number),
    "sort": Match.ObjectIncluding({
      "createdAt": Match.Optional(Number),
      "username": Match.Optional(String)
    })
  }));

  Counts.publish(this, 'accountsListCount', Meteor.users.find({}),
    { noReady: true });

  options = _.extend(options, {
    fields: { services: 0 }
  });

  var accounts = Meteor.users.find({}, options);

  return accounts;
});

Meteor.publish('accountView', function(accountId) {
  check(accountId, String);

  var accounts = Meteor.users.find({ _id: accountId });

  return accounts;
});
