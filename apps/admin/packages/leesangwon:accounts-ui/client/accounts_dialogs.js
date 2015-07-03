
var dialogDep = new Tracker.Dependency;

Accounts.ui.activeTemplate = "_signInDialogContent";

Accounts.ui.dialog = function(templateName) {
  Accounts.ui.activeTemplate = templateName;
  dialogDep.changed();
  $('#modalAccountsDialog').modal({
    show: true
  });
};

Accounts.ui.dialogClose = function() {
  $('#modalAccountsDialog').modal('hide');
};

Template.accountsDialog.helpers({
  isSignIn: function() {
    dialogDep.depend();
    return (Accounts.ui.activeTemplate === "_signInDialogContent");
  },

  isSignUp: function() {
    dialogDep.depend();
    return (Accounts.ui.activeTemplate === "_signUpDialogContent");
  },

  isResult: function() {
    dialogDep.depend();
    return (Accounts.ui.activeTemplate === "_accountsResultDialogContent");
  },

  isForgotPassword: function() {
    dialogDep.depend();
    return (Accounts.ui.activeTemplate === "_forgotPasswordDialogContent");
  }
});

Template._accountsResultDialogContent.helpers({
  resultTitle: function() {
    return Session.get('ACCOUNTS_RESULT_TITLE');
  },

  resultMessage: function() {
    return Session.get('ACCOUNTS_RESULT_MESSAGE');
  }
})