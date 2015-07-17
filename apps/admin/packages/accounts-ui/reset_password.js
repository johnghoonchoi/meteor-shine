Template.resetPasswordService.events({
  'submit #formResetPassword': function(e, instance) {
    e.preventDefault();

    var newPassword = instance.$('#new-password').val();

    Accounts.resetPassword(
      loginButtonsSession.get('resetPasswordToken'),
      newPassword,
      function (error) {
        if (error) {
          Alerts.notify('error', error.reason || "Unknown error");
        } else {
          if (doneCallback)
            doneCallback();
        }
      }
    );
  }
});
