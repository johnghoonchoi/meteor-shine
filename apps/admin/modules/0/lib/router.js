
Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading'
});

Router.onBeforeAction(function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      Accounts.ui.dialog.show('signIn');
    }
  } else {
    this.next();
  }
});

Router.route('/', function() {
  this.redirect('/home');
});
