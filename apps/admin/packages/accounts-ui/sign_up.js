Template.signUp.helpers({
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
  }
});


Template.signUpPasswordService.helpers({
  fields: function () {
    return [
      {
        fieldName: 'username',
        fieldLabel: I18n.get('accounts-ui:label_username'),
        visible: function () {
          return _.contains(
            [
              "USERNAME_AND_EMAIL",
              "USERNAME_AND_OPTIONAL_EMAIL",
              "USERNAME_ONLY"
            ],
            passwordSignupFields());
        }},
      {
        fieldName: 'email',
        fieldLabel: I18n.get('accounts-ui:label_email'),
        inputType: 'email',
        visible: function () {
          return _.contains(
            [ "USERNAME_AND_EMAIL", "EMAIL_ONLY" ],
            passwordSignupFields());
        }},
      {
        fieldName: 'email',
        fieldLabel: I18n.get('accounts-ui:label_email_optional'),
        inputType: 'email',
        visible: function () {
          return passwordSignupFields() === "USERNAME_AND_OPTIONAL_EMAIL";
        }},
      {
        fieldName: 'password',
        fieldLabel: I18n.get('accounts-ui:label_password'),
        inputType: 'password',
        visible: function () {
          return true;
        }},
      {
        fieldName: 'password-again',
        fieldLabel: I18n.get('accounts-ui:label_password_again'),
        inputType: 'password',
        visible: function () {
          // No need to make users double-enter their password if
          // they'll necessarily have an email set, since they can use
          // the "forgot password" flow.
          return _.contains(
            [ "USERNAME_AND_OPTIONAL_EMAIL", "USERNAME_ONLY" ],
            passwordSignupFields());
        }}
    ];
  },

  termsOfUseLink: function() {
    return '<a id="termsOfUse">' + I18n.get('accounts-ui:label_terms_of_use') + '</a>';
  },

  privacyPolicyLink: function() {
    return '<a id="privacyPolicy">' + I18n.get('accounts-ui:label_privacy_policy') + '</a>';
  }
});


Template.signUpPasswordService.events({
  'click #termsOfUse': function(e) {
    e.preventDefault();
    e.stopPropagation();

    Blaze.render(Template.modalTermsOfUse, document.getElementById('accountsUIModal'));
    $('#modalTermsOfUse').modal('show');
  },

  'click #privacyPolicy': function(e) {
    e.preventDefault();
    e.stopPropagation();

    Blaze.render(Template.modalPrivacyPolicy, document.getElementById('accountsUIModal'));
    $('#modalPrivacyPolicy').modal('show');
  },

  'submit #formSignUp': function(e, instance) {
    e.preventDefault();

    var options = {}; // to be passed to Accounts.createUser

    if (! instance.$('#agreements:checked').val()) {
      Alerts.notifyModal('warning', 'accounts-ui:text_agreements_required');
      return;
    }

    var username = instance.$('#login-username').val();
    var email = instance.$('#login-email').val();
    var password = instance.$('#login-password').val();

    var matchPasswordAgainIfPresent = function() {
      // notably not trimmed. a password could (?) start or end with a space
      var passwordAgain = instance.$('#login-password-again').val();
      if (passwordAgain) {
        return (password !== passwordAgain);
      }
      return true;
    };

    if (username !== null) {
      options.username = username.trim();
    }
    if (email !== null) {
      options.email = email.trim();
    }

    // notably not trimmed. a password could (?) start or end with a space
    options.password = password;

    if (! matchPasswordAgainIfPresent()) {
      Alerts.notifyModal('accounts:error_fail_password_confirm');
      return;
    }

    Accounts.createUser(options, function (error) {
      if (error) {
        Alerts.notifyModal('error', error.reason || "Unknown error");
      } else {
        $('#accountsUIModal').modal('hide');
        Alerts.dialog('msg', 'accounts-ui:text_verify_email');
      }
    });
  }
});
