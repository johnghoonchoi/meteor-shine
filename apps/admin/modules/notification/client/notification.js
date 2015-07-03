
Template.notificationsList.helpers({
  notifications: function() {
    return Notifications.find();
  }
});

Template.notificationsList.events({
  // Close notification window
  'click #close': function(e) {
    e.preventDefault();
    $('#container').removeClass('notification-set');
  }
});

Template.notificationsListItem.events({
  'click li': function(e) {
    e.preventDefault();

    $('#container').removeClass('notification-set');

    Meteor.call('notificationRead', this._id);

    Router.go(Meteor.absoluteUrl(this.msg.link));
  }
});
