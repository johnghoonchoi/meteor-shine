Meteor.publish("userData", function () {
  if (this.userId) {
    return Meteor.users.find({_id: this.userId},
      {fields: {'username': 1, 'profile': 1, 'services': 1}});
  } else {
    this.ready();
  }
});
