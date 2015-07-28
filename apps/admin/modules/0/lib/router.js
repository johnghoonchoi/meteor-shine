
Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() {
    Meteor.subscribe("userStatus");
    Meteor.subscribe('profileView');

    return (Meteor.userId()) ? [ Meteor.subscribe('notificationsList') ] : [];
  }
});

var accessControl = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      Accounts.ui.dialog.show('signIn');
      //this.next();
    }
  } else {
    this.next();
  }
};

var closeAsideMobile = function () {
  if ($('#wrapper').hasClass('mobile')) {
    if ($('#wrapper').hasClass('aside-left-set')) {
      $('#wrapper').removeClass('aside-left-set');
    }
    if ($('#wrapper').hasClass('aside-right-set')) {
      $('#wrapper').removeClass('aside-right-set');
    }
    this.next();
  } else {
    this.next();
  }
};

Router.onBeforeAction(closeAsideMobile);

Router.onBeforeAction(accessControl);


Router.route('/', function() {
  this.redirect('/home');
});
