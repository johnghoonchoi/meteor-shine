
var RESET_PASSWORD_TOKEN = "RESET_PASSWORD_TOKEN";

Accounts.onResetPasswordLink(function (token, done) {
  Session.set(RESET_PASSWORD_TOKEN, token);
  doneCallback = done;
});

Template.accountsResetPassword.created = function() {
  Session.set(RESET_PASSWORD_TOKEN, Router.current().params.token);
};

Template.accountsResetPassword.helpers({
  error: function() {
    return Session.get('entryError');
  },
  logo: function() {
    return AccountsEntry.settings.logo;
  }
});

Template.accountsResetPassword.events({
  'submit #resetPassword': function(e) {
    e.preventDefault();

    var password = $(e.target).find('[name=password]').val();
    var passwordConfirm = $(e.target).find('[name=passwordConfirm]').val();

    // validation
    if (password !== passwordConfirm)
      return Alerts.notify('error', 'accounts.error_password_confirm_fail');

    // var response = Accounts.ui.customOptions.validators.resetPassword(password);

    // if (response.errors().length > 0) {
    //   $('input').parent().removeClass('status-error');

    //   _.each(response.errors(), function(error) {
    //     var translated = "";
    //     _.each(error.messages, function(message) {
    //       translated += I18n.get(message);
    //     });
    //     var element = $(e.target).find('[name=password]').parent();
    //     element.addClass('state-error');
    //     element.next().html(translated);
    //   });

    //   return;
    // }

    if (! Session.get(RESET_PASSWORD_TOKEN))
      return Alerts.notify('error', 'accounts:error_reset_password_token_expired');

    return Accounts.resetPassword(Session.get(RESET_PASSWORD_TOKEN), password, function(error) {
      if (error) {
        Alerts.notify("error", getErrorMessage(error.reason));
      } else {
        Session.set(RESET_PASSWORD_TOKEN, null);
        Alerts.notify("success" ,'accounts:text_reset_password_success');
      }
    });
  }
});

