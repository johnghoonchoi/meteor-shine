
Template.layoutClassic.events({
  'click #content, click aside': function(e) {
    Aside.hide();
    hideBalloons();
  }
});

