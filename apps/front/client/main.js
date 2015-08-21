$(document).mouseup(function(e) {
  if (! $('.notifications').is(e.target) && $('.notifications').has(e.target).length === 0) {
    $('#container').removeClass('notifications-set')
  }
});

Meteor.subscribe('userData');
