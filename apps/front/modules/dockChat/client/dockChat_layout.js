/**
 * Created by ProgrammingPearls on 15. 8. 13..
 */

Template.dockChatLayout.onCreated(function () {

  var instance = this;
  var data = Template.currentData();

  instance.autorun(function () {
    instance.subscribe('dockmessage', data.user._id);
  });

});
Template.dockChatLayout.helpers({
  messages: function () {
    return Messages.find();
  }
});

Template.dockChatFooter.events({
  'keydown .dockChat-textarea, keyup .dockChat-textarea' : function (e, instance) {

    if (e.type=="keyup" && e.which == 13) {

      var data = {
        to_id: this.user._id,
        text: e.currentTarget.value
      };
      Meteor.call('messageInput', data, function (err, result) {
        if (err) console.error('err', err);
        console.log('result', result);
      });

      e.currentTarget.value = "";
    }
  }
});
