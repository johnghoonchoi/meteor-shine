/**
 * publish functions for 'accounts' collection
 * which have to be used for Admin only
 */

Meteor.publish("userData", function () {
  if (this.userId) {
    return Meteor.users.find(
      { _id: this.userId },
      { fields: { oauths: 1 }}
    );
  } else {
    this.ready();
  }
});

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

  var accounts = Meteor.users.find({}, options);

  return accounts;
});

Meteor.publish('accountView', function(accountId) {
  check(accountId, String);

  var accounts = Meteor.users.find({ _id: accountId });

  return accounts;
});
