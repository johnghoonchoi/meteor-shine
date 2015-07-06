Template.headerDefault.helpers({
  notificationsCount: function() {
    return Counts.get('notificationsUnreadCount');
  }
});


Template.headerDefault.events({
  'click [data-toggle=aside-left]': function() {

    var wrapper = $('#wrapper');

    if (wrapper.hasClass('aside-right-set') && wrapper.hasClass('mobile')) {
      // Aside Right is On && Mobile
      wrapper.removeClass('aside-right-set')
             .addClass('aside-left-set');
    }
    if (wrapper.hasClass('aside-right-set') && (! wrapper.hasClass('mobile'))) {
      // Aside Right is On && Not Mobile
      wrapper.removeClass('aside-right-set')
             .removeClass('aside-left-set'); // When Not Mobile, ! aside-left-set means its on
    } else {
      // In Other Situations
      wrapper.toggleClass('aside-left-set');
    }

  },

  'click [data-toggle=aside-right]': function() {
    var wrapper = $('#wrapper');
    if (wrapper.hasClass('mobile')) {
      wrapper.removeClass('aside-left-set')
             .toggleClass('aside-right-set');
    } else {
      wrapper.toggleClass('aside-right-set');
    }
  },

  'click [data-toggle=notifications]': function() {
    var wrapper = $('#wrapper');
    if (wrapper.hasClass('mobile')) {
      wrapper.removeClass('aside-left-set')
             .toggleClass('aside-right-set');
    } else {
      wrapper.toggleClass('aside-right-set');
    }
  }
});

