Template.bootstrapSwitch.onCreated(function() {
});

Template.bootstrapSwitch.onRendered(function() {
  this.$('.switch').bootstrapSwitch();
});

Template.bootstrapSwitch.helpers({
  checked: function() {
    return (this.state) ? "checked" : "";
  }
});

