
Template.bootstrapToggle.onRendered(function() {
  this.$('input').bootstrapToggle();
});

Template.bootstrapToggle.helpers({
  name: function() {
    return this.name;
  },

  checked: function() {
    return (this.state) ? "checked" : "";
  }
});

