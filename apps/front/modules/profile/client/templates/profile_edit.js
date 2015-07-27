Template.profileEditForm.events({
  'submit #formProfileEdit': function(e, instance) {
    e.preventDefault();

    var object = {
      email: instance.$('#email').val().trim()
    };

    var validation = AccountValidator.validateUpdate(object);
    if (validation.hasError()) {
      Alerts.notify('error', 'validation_errors');
      return;
    }

    Meteor.call('profileUpdate', object, function(error) {
      if (error) {
        Alerts.notify('error', error.message);
      } else {
        Alerts.notify('success', 'profile_update_success');
      }
    });
  }
});
