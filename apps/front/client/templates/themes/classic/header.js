Template.headerClassic.onCreated(function () {
  var instance = this;

  instance.autorun(function() {
    instance.subscribe('systemView');
  });

  instance.siteName = function() {
    return Systems.findOne({ _id: 'siteName' });
  }
});

Template.headerClassic.helpers({
  siteName: function() {
    return Template.instance().siteName();
  },

  notificationsCount: function() {
    return Counts.get('notificationsUnreadCount');
  }
});

Template.headerClassic.events({
  'click [data-toggle=navigations]': function(e) {
    e.preventDefault();

    $('#container').toggleClass('aside-left-on');
  },

  'click [data-toggle=notifications]': function(e, instance) {
    e.preventDefault();

    instance.$('#notifications').fadeIn('slow');
  }
});
