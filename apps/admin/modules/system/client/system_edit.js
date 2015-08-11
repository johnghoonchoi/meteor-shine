Template.systemEdit.onCreated(function() {
  var instance = this;

  instance.autorun(function() {
    instance.subscribe('systemView', {});
  });

  instance.siteName = function() {
    return Systems.findOne({ _id: 'siteName' });
  };

  instance.facebookLogin = function() {
    return Systems.findOne({ _id: 'facebookLogin' });
  };

  instance.meetupLogin = function() {
    return Systems.findOne({ _id: 'meetupLogin' });
  };
});

Template.systemEdit.helpers({
  siteName: function() {
    return Template.instance().siteName();
  },

  facebookLogin: function() {
    return Template.instance().facebookLogin();
  },

  meetupLogin: function() {
    return Template.instance().meetupLogin();
  }
});

Template.systemEdit.events({
  'submit #formSystemEdit': function(e, instance) {
    e.preventDefault();

    var objects = [
      {
        _id: 'siteName',
        value: instance.$('#siteName').val().trim()
      },
      {
        _id: 'facebookLogin',
        appId: instance.$('#facebook-id').val().trim(),
        secret: instance.$('#facebook-secret').val().trim()
      },
      {
        _id: 'meetupLogin',
        clientId: instance.$('#meetup-id').val().trim(),
        secret: instance.$('#meetup-secret').val().trim(),
        apiKey: instance.$('#meetup-api-key').val().trim()
      }
    ];


    Meteor.call('systemUpsert', objects, function(error) {
      if (error) {
        Alerts.notify('error', error.message);
      } else {
        Alerts.notify('success', 'text_system_edit_done');
      }
    });
  }
});
