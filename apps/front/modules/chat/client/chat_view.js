/**
 * Created by ProgrammingPearls on 15. 8. 13..
 */

Template.chatView.onCreated(function () {

  var instance = this;
  var data = Template.currentData();
  var receiveId = data.user._id;

  instance.autorun(function () {
    instance.subscribe('chatmessages', receiveId);
  });

});
Template.chatView.helpers({
  chatmessages: function () {
    return chatMessages.find();
  }
});

Template.chatTextarea.events({
  'keydown .chat-textarea, keyup .chat-textarea' : function (e) {
    if (e.type === "keyup" && e.which === 13) {

      var receivedId = this.user._id;
      var content = e.currentTarget.value;

      var data = {
        receiveId: receivedId,
        content: content
      };

      Meteor.call('chatMessageInsert', data, function (err, result) {
        if (err) console.error('err', err);
        console.log('result', result);
      });

      e.currentTarget.value = "";
    }
  }
});
