Template.systemEdit.onCreated(function() {
  var instance = this;

  instance.autorun(function() {
    instance.subscribe('systemView', {});
  });

  instance.siteName = function() {
    return Systems.findOne({ _id: 'siteName' });
  };
});

Template.systemEdit.helpers({
  siteName: function() {
    return Template.instance().siteName();
  }
});

Template.systemEdit.events({
  'submit #formSystemEdit': function(e, instance) {
    e.preventDefault();

    var object = {
      _id: 'siteName',
      value: instance.$('#siteName').val().trim()
    };

    Meteor.call('systemUpsert', object, function(error) {
      if (error) {
        Alerts.notify('error', error.message);
      } else {
        Alerts.notify('success', 'text_system_edit_done');
      }
    });
  }
});
