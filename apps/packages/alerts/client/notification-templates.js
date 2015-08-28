Template.meteorAlerts.helpers({
  alerts: function() {
    return Alerts.collection.find({ template: 'window' });
  }
});

Template.meteorAlert.onRendered(function() {
  var alert = this.data;
  if (alert && alert.duration > 0) {
    Meteor.setTimeout(function () {
      Alerts.collection.remove(alert._id);
    }, alert.duration);
  }
});

var style = {
  error: {
    'class': 'alert-danger',
    icon: 'fa-minus-circle'
  },
  info: {
    'class': 'alert-info',
    icon: 'fa-exclamation-circle'
  },
  warning: {
    'class': 'alert-warning',
    icon: 'fa-exclamation-triangle'
  },
  success: {
    'class': 'alert-success',
    icon: 'fa-thumbs-o-up'
  }
};

Template.meteorAlert.helpers({
  alertClass: function() {
    return style[this.type].class;
  },
  alertIcon: function() {
    return style[this.type].icon;
  }
});

Template.meteorAlert.events({
  'click .close': function() {
    Alerts.collection.remove(this._id);
  }
});


Template.meteorModalAlerts.helpers({
  alerts: function() {
    return Alerts.collection.find({ template: 'modal' });
  }
});

Template.meteorModalAlerts.onRendered(function() {
  var alert = this.data;
  if (alert && alert.duration > 0) {
    Meteor.setTimeout(function () {
      Alerts.collection.remove(alert._id);
    }, alert.duration);
  }
});

