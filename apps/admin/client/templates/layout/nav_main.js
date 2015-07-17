Template.navMain.events({

  'click [data-action=signIn]': function() {
    Accounts.ui.render('signIn');
  },

  'click [data-action=signOut]': function() {
    Meteor.logout();
    Router.go('home');
  }

});
