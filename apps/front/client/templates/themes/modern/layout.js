/**
 * designed to fit the layout for mobile app
 *
 * animate main content
 */

var ANIMATION_DURATION = 300;

Template.layoutModern.events({
  'click #content, click aside': function(e) {
    Aside.slide();
    hideBalloons();
  }
});

Template.yieldWrapper.onCreated(function() {
  console.log('yieldWrapper created');
});

Template.yieldWrapper.onDestroyed(function() {
  console.log('yieldWrapper destroyed');
});

Template.yieldWrapper.onRendered(function() {
  this.find('#content')._uihooks = {
    insertElement: function(node, next) {
      console.log('yieldWrapper insertElement: ');

      var page = $(node).hasClass('page');
      if (! page) {
        return $(node).insertBefore(next);
      }

      var start = '100%';

      $(node).insertBefore(next).velocity({ translateX: [0, start]}, {
        duration: ANIMATION_DURATION,
        easing: 'ease-in-out',
        queue: false
      });
    },

    removeElement: function(node) {
      console.log('yieldWrapper removeElement: ');

      var page = $(node).hasClass('page');
      if (! page) {
        return $(node).remove();
      }

      var end = '-100%';
      $(node).velocity({ translateX: end }, {
        duration: ANIMATION_DURATION,
        easing: 'ease-in-out',
        queue: false,
        complete: function() {
          $(node).remove();
        }
      });
    }
  };
});

Template.yieldWrapper.helpers({
  templateName: function() {
    return Router.current().route.getName();
  },

  header: function() {
    return (Router.current().route.getName() !== 'postView') ?
      'headerModern' : 'headerStack';
  },

  content: function() {
    return Router.current().route.getName();
  },

  dataContext: function() {
    return Template.currentData();
  }
});
