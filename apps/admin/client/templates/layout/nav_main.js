Template.navMain.events({

  'click [data-action=signIn]': function() {
    Accounts.ui.dialog.show('signIn');
  },

  'click [data-action=signOut]': function() {
    Meteor.logout();
    Router.go('home');
  }

});
