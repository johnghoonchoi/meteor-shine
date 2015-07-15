

Template.signIn.helpers({
  services: function() {
    return getLoginServices();
  },

  isPasswordService: function () {
    return this.name === 'password';
  },

  hasOtherServices: function () {
    return getLoginServices().length > 1;
  },

  hasPasswordService: function() {
    return hasPasswordService();
  },

  singleService: function () {
    var services = getLoginServices();
    if (services.length !== 1)
      throw new Error(
        "Shouldn't be rendering this template with more than one configured service");
    return services[0];
  },

  configurationLoaded: function () {
    return Accounts.loginServicesConfigured();
  },

  showCreateAccountLink: function () {
    return !Accounts._options.forbidClientAccountCreation;
  }
});

Template.signIn.events({
  'click #signUpLink': function(e) {
    e.preventDefault();

    Accounts.ui.render('signUp');
  }
});

Template.signInPasswordService.helpers({
  fields: function () {
    return [
      {
        fieldName: 'username-or-email',
        fieldLabel: I18n.get('accounts-ui:label_username_or_email'),
        visible: function () {
          return _.contains(
            ["USERNAME_AND_EMAIL", "USERNAME_AND_OPTIONAL_EMAIL"],
            passwordSignupFields());
        }},
      {
        fieldName: 'username',
        fieldLabel: I18n.get('accounts-ui:label_username'),
        visible: function () {
          return passwordSignupFields() === "USERNAME_ONLY";
        }},
      {
        fieldName: 'email',
        fieldLabel: I18n.get('accounts-ui:label_email'),
        inputType: 'email',
        visible: function () {
          return passwordSignupFields() === "EMAIL_ONLY";
        }},
      {
        fieldName: 'password',
        fieldLabel: I18n.get('accounts-ui:label_password'),
        inputType: 'password',
        visible: function () {
          return true;
        }}
    ];
  },

  showForgotPasswordLink: function () {
    return _.contains(
      ["USERNAME_AND_EMAIL", "USERNAME_AND_OPTIONAL_EMAIL", "EMAIL_ONLY"],
      passwordSignupFields());
  }
});


Template.signInPasswordService.events({
  'click #forgotPasswordLink': function(e) {
    e.preventDefault();

    Accounts.ui.render('forgotPassword');
  },

  'submit #formSignIn': function(e, instance) {
    e.preventDefault();

    var username = instance.$('#login-username').val();
    var email = instance.$('#login-email').val();
    var usernameOrEmail = instance.$('#login-username-or-email').val();
    // notably not trimmed. a password could (?) start or end with a space
    var password = instance.$('#login-password').val();

    var loginSelector;
    if (username) {
      loginSelector = { username: username.trim() };
    } else if (email) {
      loginSelector = { email: email.trim() };
    } else if (usernameOrEmail) {
      loginSelector = usernameOrEmail.trim();
    } else {
      Alerts.notifyModal('error', 'accounts-ui:error_input_required');
      return;
    }

    Meteor.loginWithPassword(loginSelector, password, function (error, result) {
      if (error) {
        //loginButtonsSession.errorMessage(error.reason || "Unknown error");
        Alerts.notifyModal('error', error.reason || "Unknown error");
      } else {
        $('#accountsUIModal').modal('hide');
      }
    });
  }
});

Template.backToSignIn.events({
  'click #backToSignIn': function(e) {
    e.preventDefault();

    Accounts.ui.render('signIn');
  }
});
