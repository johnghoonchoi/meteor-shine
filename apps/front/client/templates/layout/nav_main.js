
Template.navMain.onCreated(function() {
  var instance = this;

  // fixed aside
  instance.leftPin = new ReactiveVar((localStorage.getItem('leftPin') === "true"));
  instance.rightPin = new ReactiveVar((localStorage.getItem('rightPin') === "true"));

  instance.autorun(function() {
    Meteor.subscribe('userData');
  });

});

Template.navMain.helpers({
  'leftPin': function () {
    return Template.instance().leftPin.get() ? templateComment.pin_fix : templateComment.pin_notFix;
  },

  'rightPin': function () {
    return Template.instance().rightPin.get() ? templateComment.pin_fix : templateComment.pin_notFix;
  }
});

Template.navMain.events({

  'click [data-action=signIn]': function(e) {
    e.preventDefault();
    e.stopPropagation();

    Accounts.ui.dialog.show('signIn', function() {
      $('#login-username-or-email').focus();
    });

  },

  'click [data-action=signOut]': function(e) {
    e.preventDefault();
    e.stopPropagation();

    Meteor.logout();
    Router.go('home');
  },

  'click [data-action=leftPin]': function (e, instance) {
    e.preventDefault();
    e.stopPropagation();

    var pinStatus = instance.leftPin.get();

    localStorage.setItem('leftPin', ! pinStatus);
    instance.leftPin.set(! pinStatus);
  }

});

