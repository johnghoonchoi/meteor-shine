/**
 * Created by ProgrammingPearls on 15. 8. 13..
 */


//
//
// chatView
Template.chatFrame.onCreated(function () {

  var instance = this;
  var data = Template.currentData();
  var receiveId = data.user._id;

  instance.autorun(function () {
    instance.subscribe('chatMessages', receiveId);
  });

  instance.beginEntered = new ReactiveVar(false);
});

Template.chatFrame.onDestroyed(function () {
  this.data.chatTemplate = null;
});

Template.chatFrame.helpers({
  chatMessagesList: function () {
    return ChatMessages.find();
  },

  beingEntered: function () {
    return Template.instance().beginEntered.get();
  }
});

Template.chatFrame.events({
  // header events
  'click a.chat-minimize': function (e, instance) {

    var data = instance.data;

    e.preventDefault();

  },

  'click a.chat-exit': function (e, instance) {

    e.preventDefault();
    var data = instance.data;

    Blaze.remove(data.chatTemplate);
  },

  // footer events

  'focus .chat-textarea': function (e) {
    console.log('focus');
    var thisElement = $(e.currentTarget)[0];
    thisElement.style.background = "yellow";
  },

  'focusout .chat-textarea': function (e) {
    console.log('focusout');
    $(e.currentTarget).removeAttr('style');
  },

  'keyup .chat-textarea': function (e, instance) {
    console.log('keydown');
    var thisElement = $(e.currentTarget)[0];
    var content = thisElement.value;

    // remove line breaks from string
    content = content.replace(/(\r\n|\n|\r)/gm,"");

    console.log('content', content);
    console.log('content.length', content.length);

    if (content.length ===0 || content === "" || content === null) {
      instance.beginEntered.set(false);
      return;
    }

    instance.beginEntered.set(true);

    // pressed enter
    if (e.which === 13) {

      e.stopPropagation();
      e.preventDefault();

      // clear textarea
      thisElement.value = "";

      instance.beginEntered.set(false);

      var receivedId = this.user._id;
      if (content.length ===0 || content === "" || content === null) return;

      var data = {
        receiveId: receivedId,
        content: content
      };

      // insert message
      Meteor.call('chatMessageInsert', data);

    }
  }
});

//
//
// chatMessageList
Template.chatMessageListItem.onRendered(function () {

  // scroll to bottom of div
  var mainDiv = $('.chat-view > main')[0];
  mainDiv.scrollTop = mainDiv.scrollHeight;

});

Template.chatMessageListItem.helpers({
  isUserMessage: function (from_id) {
    return Meteor.userId() === from_id ? true : false;
  }
});

Template.chatBeingEnteredTheMessage.onRendered(function () {

  // scroll to bottom of div
  var mainDiv = $('.chat-view > main')[0];
  mainDiv.scrollTop = mainDiv.scrollHeight;
});
