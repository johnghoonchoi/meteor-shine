
Meteor.publish("accountData", function (filter) {
  check(filter, Object);
  return Meteor.users.find(filter, { fields: { services: 0 } });
});

Meteor.publish("myData", function () {
  if (this.userId) {
    return Meteor.users.find({_id: this.userId}, { fields: { services: 0 } });
  } else {
    this.ready();
  }
});
