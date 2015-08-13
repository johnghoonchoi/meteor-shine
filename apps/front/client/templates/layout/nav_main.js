
Template.navMain.onCreated(function() {
  var instance = this;

  // fixed aside
  instance.leftPin = new ReactiveVar((localStorage.getItem('leftPin') === "true"));
  instance.rightPin = new ReactiveVar((localStorage.getItem('rightPin') === "true"));

  // css class name
  instance.pin_fix = "blackiconcolor";
  instance.pin_notFix = "whiteiconcolor";

  instance.autorun(function() {
    Meteor.subscribe('myData');
  });

});

Template.navMain.helpers({
  'leftPin': function () {
    var instance = Template.instance();
    return instance.leftPin.get() ? instance.pin_fix : instance.pin_notFix;
  },

  'rightPin': function () {
    var instance = Template.instance();
    return instance.rightPin.get() ? instance.pin_fix : instance.pin_notFix;
  }
});

Template.navMain.events({

  'click [data-action=leftPin]': function (e, instance) {
    e.preventDefault();
    e.stopPropagation();

    var pinStatus = instance.leftPin.get();

    localStorage.setItem('leftPin', ! pinStatus);
    instance.leftPin.set(! pinStatus);
  }

});

