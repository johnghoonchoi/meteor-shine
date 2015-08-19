
Router.configure({
  layoutTemplate: function() {
    return 'layout' + Theme.get().capitalize();
  },
  loadingTemplate: 'loading'
});

var accessControl = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn())
      this.render(this.loadingTemplate);
    else
      Accounts.ui.dialog.show('signIn');
  } else {
    this.next();
  }
};

Router.onBeforeAction(accessControl, { only: [
  'myworks',
  'postWrite',
  'postEdit'
]});

Router.route('/', function() {
  this.redirect('/home');
});
