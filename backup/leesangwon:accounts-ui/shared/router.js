/**
 * set reset-password URI
 */
Router.route('accountsResetPassword', {
  path: 'reset-password/:token',
  layoutTemplate: 'layout'
});

/**
 * set verify-email URI
 */
Router.route('accountsVerifyEmail', {
  path: 'verify-email/:token',
  layoutTemplate: 'layout',

  onBeforeAction: function() {
    Accounts.verifyEmail(this.params.token, function(error) {
      if (error) {
        Alerts.notify('error', error.reason);
      } else {
        Accounts._enableAutoLogin();
      }
    });
    this.next();
  }
});


