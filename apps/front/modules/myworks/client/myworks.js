Template.myworks.onCreated(function() {
  Navigations.path.set('myworks');

  this.data.mode = new ReactiveVar('draft');
});

Template.myworks.onDestroyed(function() {
});

Template.myworks.onRendered(function() {
});
Template.myworks.helpers({

});
Template.myworks.events({
  'click [data-switch]': function(e, instance) {
    e.preventDefault();
    e.stopImmediatePropagation();

    var $this = $(e.currentTarget);
    $this.addClass('active');
    $this.siblings().not($this).removeClass('active');

    if ($this.attr('data-switch') === 'draft')
      instance.data.mode.set('draft');
    else
      instance.data.mode.set('public');
  }
});
