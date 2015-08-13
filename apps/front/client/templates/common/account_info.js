Template.accountInfo.events({
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
  }
});

