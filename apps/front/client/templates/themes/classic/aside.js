/**
 * Created by ProgrammingPearls on 15. 8. 7..
 */

Template.asideLeftClassic.onCreated(function() {
});

Template.asideLeftClassic.onRendered(function () {
  Aside.show();
});

Template.asideLeftClassic.helpers({
  active: function() {
    return Aside.isPined('left') ? "active" : "";
  }
});

Template.asideLeftClassic.events({
  'click .aside-pin': function(e, instance) {
    e.preventDefault();
    e.stopPropagation();

    instance.$('.aside-pin').toggleClass('active');
    Aside.togglePin('left');
  }
});
