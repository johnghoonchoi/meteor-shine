
Template._forgotPasswordDialogContent.events({
  'click #signIn': function(e) {
    e.preventDefault();

    Accounts.ui.dialog('_signInDialogContent');
  },

  'submit #formForgotPassword': function(e) {
    e.preventDefault();

    var attributes = {
      email: $(e.target).find('[name=forgottenEmail]').val()
    };

    var validator = new Validator();
    if (! validator.api.isEmail(attributes.email))
      return Alerts.notify('error', 'error_invalid_email');

    Accounts._setLoggingIn(true);

    Meteor.call('forgotPasswordExt', attributes, I18n.getLanguage(), function(error) {

      Accounts._setLoggingIn(false);

      if (error)
        return Alerts.notify('error', getErrorMessage(error.reason));

      var messageHTML = "<p>" + I18n.get('accounts:text_reset_password') + "</p>";
      Session.set('ACCOUNTS_RESULT_TITLE', I18n.get('accounts:title_reset_password'));
      Session.set('ACCOUNTS_RESULT_MESSAGE', messageHTML);
      return Accounts.ui.dialog('_accountsResultDialogContent');
    });
  }
});
