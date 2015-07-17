
// returns an array of the login services used by this app. each
// element of the array is an object (eg {name: 'facebook'}), since
// that makes it useful in combination with handlebars {{#each}}.
//
// don't cache the output of this function: if called during startup (before
// oauth packages load) it might not include them all.
//
// NOTE: It is very important to have this return password last
// because of the way we render the different providers in
// login_buttons_dropdown.html
getLoginServices = function () {
  var self = this;

  // First look for OAuth services.
  var services = Package['accounts-oauth'] ? Accounts.oauth.serviceNames() : [];

  // Be equally kind to all login services. This also preserves
  // backwards-compatibility. (But maybe order should be
  // configurable?)
  services.sort();

  // Add password, if it's there; it must come last.
  if (hasPasswordService())
    services.push('password');

  return _.map(services, function(name) {
    return {name: name};
  });
};

hasPasswordService = function () {
  return !!Package['accounts-password'];
};

dropdown = function () {
  return hasPasswordService() || getLoginServices().length > 1;
};


//
// loginButtonLoggedOut template
//

Template._signInDialogContent.helpers({
  services: getLoginServices,
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

Template._signInDialogContent.events({
  'click #signUp': function(e) {
    e.preventDefault();

    Accounts.ui.dialog('_signUpDialogContent');
  }
});

// return all login services, with password last
Template.allSignInServices.helpers({
  services: getLoginServices,

  isPasswordService: function () {
    return this.name === 'password';
  },

  hasOtherServices: function () {
    return getLoginServices().length > 1;
  },

  hasPasswordService: hasPasswordService
});


Template.passwordService.events({
  'click #forgotPassword': function(e) {
    e.preventDefault();

    Accounts.ui.dialog('_forgotPasswordDialogContent');
  },

  'submit #formSignIn': function(e) {
    e.preventDefault();

    var email = $('input[name="email"]').val();
    email = email.trim().toLowerCase();

    if (! email)
      return Alerts.notifyModal("error", "error_input_required");

    var password = $(e.target).find('[name=password]').val();
    // var staySignedIn = $(e.target).find('[name=remember]:checked').val();

    return Meteor.loginWithPassword(email, password, function(error) {

      if (error) {
        Alerts.notifyModal("error", getErrorMessage(error.reason));
      } else {
        $('#modalAccountsDialog').modal('hide');

        // Meteor.call('staySignedIn', (staySignedIn === "1"));

        if (Accounts.ui.customOptions.postSignInProc)
          Accounts.ui.customOptions.postSignInProc();
      }
    });
  }
});
