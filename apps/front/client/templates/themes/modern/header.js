Template.headerModern.onCreated(function () {
  var instance = this;

  instance.autorun(function() {
    instance.subscribe('systemView');
  });

  instance.siteName = function() {
    return Systems.findOne({ _id: 'siteName' });
  }
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
  'click [data-toggle=navigations]': function(e) {
    e.preventDefault();
    e.stopPropagation();

    $('#container').toggleClass('aside-left-on');
  },

  'click [data-toggle=notifications]': function(e, instance) {
    e.preventDefault();

    instance.$('#notifications').fadeIn('slow');
  }
});

Template.headerStack.helpers({
  notificationsCount: function() {
    return Counts.get('notificationsUnreadCount');
  }
});

Template.headerStack.events({
  'click [data-toggle=back]': function(e) {
    e.preventDefault();
    e.stopPropagation();

    Yields.pop();
    history.back();
  },

  'click [data-toggle=notifications]': function(e, instance) {
    e.preventDefault();

    instance.$('#notifications').fadeIn('slow');
  }
});
