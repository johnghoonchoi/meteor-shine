/**
 * publish functions for 'accounts' collection
 * which have to be used for Admin only
 */

Meteor.publish('accountsList', function(options) {
  check(options, Match.ObjectIncluding({
    "limit": Match.Optional(Number),
    "sort": Match.ObjectIncluding({
      "loginAt": Match.Optional(Number),
      "createdAt": Match.Optional(Number),
      "username": Match.Optional(String)
    })
  }));

  Counts.publish(this, 'accountsListCount', Meteor.users.find({}),
    { noReady: true });

  options = _.extend(options, {
    fields: {
      username: 1,
      emails: 1,
      oauths: 1,
      services: 1,
      roles: 1,
      loginAt: 1,
      createdAt: 1
    }
  });

  var accounts = Meteor.users.find({}, options);

  return accounts;
});

Meteor.publish('accountView', function(accountId) {
  check(accountId, String);

  var accounts = Meteor.users.find(
    { _id: accountId },
    {
      fields: {
        username: 1,
        emails: 1,
        oauths: 1,
        services: 1,
        roles: 1,
        loginAt: 1,
        createdAt: 1
      }
    }
  );

  return accounts;
});
