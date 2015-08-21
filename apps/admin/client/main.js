$(document).mouseup(function(e) {
  if (! $('.notifications').is(e.target) && $('.notifications').has(e.target).length === 0) {
    $('#container').removeClass('notifications-set')
  }
});

Meteor.subscribe('userData');

Meteor.startup(function() {
  // Todo 추후 테마적용 보완
  //setTheme(loadTheme());
});
