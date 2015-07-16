Template.forgotPasswordService.events({
  'submit #formForgotPassword': function(e, instance) {
    e.preventDefault();

    var email = instance.$("#forgot-password-email").val();
    if (! email) {
      Alerts.notifyModal('error', 'accounts-ui:error_input_required');
      return;
    }

    if (email.indexOf('@') !== -1) {

      Accounts._setLoggingIn(true);

      Accounts.forgotPassword({ email: email }, function (error) {

        Accounts._setLoggingIn(false);

        if (error)
          Alerts.notifyModal('error', error.reason || "Unknown error");
        else
          Alerts.notifyModal('success', "Email sent");
      });
    } else {
      Alerts.notifyModal('error', 'accounts-ui:error_invalid_input');
    }
  }
});
