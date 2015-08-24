
Template.layoutModern.events({
  'click #content, click aside': function(e) {
    Aside.hide();
    hideBalloons();
  }
});

