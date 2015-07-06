Template.meteorAlertDialog.onRendered(function() {
  $('#meteorAlertDialog').modal('show');
});

Template.meteorAlertDialog.helpers({
  isConfirm: function() {
    return this.type === 'confirm';
  }
});

var removeDialog = function(view) {
  $('#meteorAlertDialog').modal('hide');

  Meteor.setTimeout(function() {
    Blaze.remove(view);
  }, 1000);
};

Template.meteorAlertDialog.events({
  'click #btnClose': function() {
    var data = this;
    removeDialog(data.view);

    if (data.callback)
      data.callback(false);
  },

  'click #btnYes': function() {
    var data = this;
    removeDialog(data.view);

    if (data.callback)
      data.callback(true);
  },

  'click #btnNo': function() {
    var data = this;
    removeDialog(data.view);

    if (data.callback)
      data.callback(false);
  }
});

