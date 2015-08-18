/**
 * Created by ProgrammingPearls on 15. 8. 13..
 */


//
//
// chatView
Template.chatView.onCreated(function () {

  var instance = this;
  var data = Template.currentData();
  var receiveId = data.user._id;

  var chatTemplate = data.chatTemplate;
  instance.subscribe('chatmessages', receiveId);

});

Template.chatView.helpers({
  chatmessages: function () {
    return chatMessages.find();
  }
});

//
//
// chatHeader
Template.chatHeader.onRendered(function () {
  
});


Template.chatHeader.events({
  'click a.chat-minimize' : function (e) {
    console.log('1');
  },

  'click a.chat-exit' : function (e, instance) {

    e.preventDefault();

    Blaze.remove(instance.data.chatTemplate);
  }
});

//
//
// chatMessageList
Template.chatMessageList.onRendered(function () {
  //// scroll to bottom of div
  var mainDiv = $('.chat-main')[0];
  mainDiv.scrollTop = mainDiv.scrollHeight;

});

Template.chatMessageList.helpers({
  isUserMessage: function (from_id) {
    return Meteor.userId() === from_id ? true : false;
  }
});

Template.chatMessageList.events({

});

//
//
// chatTextarea
Template.chatTextarea.events({
  'keypress .chat-textarea' : function (e) {

    // pressed enter
    if (e.type==="keypress" && e.which === 13) {
      e.stopPropagation();
      e.preventDefault();

      var thisDiv = $(e.currentTarget)[0];
      var receivedId = this.user._id;
      var content = thisDiv.value;

      if (content === "" || content === null) return;

      var data = {
        receiveId: receivedId,
        content: content
      };

      // insert message
      Meteor.call('chatMessageInsert', data);

      // clear textarea
      thisDiv.value = "";

    }
  }
});

