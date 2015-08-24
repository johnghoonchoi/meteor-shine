Template.headerModern.onCreated(function () {
  var instance = this;

  instance.autorun(function() {
    instance.subscribe('systemView');
  });

  instance.siteName = function() {
    return Systems.findOne({ _id: 'siteName' });
  };
});

Template.headerModern.helpers({
  siteName: function() {
    return Template.instance().siteName();
  },

  notificationsCount: function() {
    return Counts.get('notificationsUnreadCount');
  }
});

Template.headerModern.events({
  'click [data-toggle=navigations]': function() {
    Aside.toggle('left');
  },

  'click [data-toggle=notifications]': function(e, instance) {
    e.preventDefault();

    instance.$('#notifications').fadeIn('slow');
  }
});
