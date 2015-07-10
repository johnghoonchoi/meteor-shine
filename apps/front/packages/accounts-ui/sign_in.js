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
  }
});

Template.signInPasswordService.helpers({
  fields: function () {
    return [
      { fieldName: 'username-or-email', fieldLabel: 'Username or Email',
        visible: function () {
          return _.contains(
            ["USERNAME_AND_EMAIL", "USERNAME_AND_OPTIONAL_EMAIL"],
            passwordSignupFields());
        }},
      { fieldName: 'username', fieldLabel: 'Username',
        visible: function () {
          return passwordSignupFields() === "USERNAME_ONLY";
        }},
      { fieldName: 'email', fieldLabel: 'Email', inputType: 'email',
        visible: function () {
          return passwordSignupFields() === "EMAIL_ONLY";
        }},
      { fieldName: 'password', fieldLabel: 'Password', inputType: 'password',
        visible: function () {
          return true;
        }}
    ];
  },

  inForgotPasswordFlow: function () {
    return loginButtonsSession.get('inForgotPasswordFlow');
  },

  inLoginFlow: function () {
    return !loginButtonsSession.get('inSignupFlow') && !loginButtonsSession.get('inForgotPasswordFlow');
  },

  inSignupFlow: function () {
    return loginButtonsSession.get('inSignupFlow');
  },

  showCreateAccountLink: function () {
    return !Accounts._options.forbidClientAccountCreation;
  },

  showForgotPasswordLink: function () {
    return _.contains(
      ["USERNAME_AND_EMAIL", "USERNAME_AND_OPTIONAL_EMAIL", "EMAIL_ONLY"],
      passwordSignupFields());
  }
});
