/**
 * Created by ProgrammingPearls on 15. 8. 13..
 */


//
//
// chatView
Template.chatFrame.onCreated(function () {

  // initialize
  var instance = this;
  var data = Template.currentData();
  var toId = data.user._id;

  // other side input message
  instance.status = "input";
  instance.isInput = false;
  Meteor.call('chatStatusRemove', instance.status);

  // subscribe
  instance.autorun(function () {

    instance.subscribe('chatMessages', toId);

    instance.subscribe('chatStatus', toId, instance.status);

  });

  instance.latelyDate = function () {
    return ChatMessages.findOne({}, { sort: { createdAt: -1 }});
  };

});

Template.chatFrame.onDestroyed(function () {
  this.data.chatTemplate = null;

  // other side input message
  this.isInput = false;
  Meteor.call('chatStatusRemove', this.status);
});

Template.chatFrame.helpers({
  chatMessagesList: function () {
    return ChatMessages.find({}, { sort : { createdAt: 1 } });
  }
});

Template.chatFrame.events({

  // header events
  //'click a.chat-minimize': function (e, instance) {
  //  e.preventDefault();
  //  e.stopPropagation();
  //},

  'click a.chat-exit': function (e, instance) {

    e.stopPropagation();
    e.preventDefault();
    var data = instance.data;

    Blaze.remove(data.chatTemplate);
  },

  // footer events
  'focus .chat-textarea': function (e) {
    var thisElement = $(e.currentTarget)[0];
    thisElement.style.background = "yellow";
  },

  'focusout .chat-textarea': function (e) {
    $(e.currentTarget).removeAttr('style');
  },

  'keyup .chat-textarea': function (e, instance) {

    var thisElement = $(e.currentTarget)[0];
    var content = thisElement.value;

    // remove line breaks from string
    content = content.replace(/(\r\n|\n|\r)/gm,"");

    var toId = this.user._id;
    var data = {
      toId: toId
    };

    // input text
    if (content.length === 0 || content === "" || content === null) {
      if (instance.isInput) {
        instance.isInput = !instance.isInput;
        console.log('instance.status', instance.status);
        Meteor.call('chatStatusRemove', instance.status);
      }

      // clear textarea
      thisElement.value = "";

      return;
    } else {
      if (!instance.isInput) {
        instance.isInput = !instance.isInput;
        Meteor.call('chatStatusInsert', data);
      }
    }

    // input enter
    if (e.which === 13) {

      e.stopPropagation();
      e.preventDefault();

      // clear textarea
      thisElement.value = "";

      // lately date to less than 5 minutes date.
      var latelyDate = instance.latelyDate() || new Date();

      var inputDate = new Date();

      var diffMinutes = Math.abs(moment(latelyDate.createdAt).diff(inputDate, "minutes"));
      var timeScope = 10;

      if (!latelyDate || diffMinutes >= timeScope) {
        // insert message (type=date)
        data = {
          toId: toId,
          type: "date"
        };
        Meteor.call('chatMessageInsert', data);
      }

      var data = {
        toId: toId,
        content: content,
        type: "msg"
      };

      // insert message (type=msg)
      Meteor.call('chatMessageInsert', data);

      // remove input status
      Meteor.call('chatStatusRemove', instance.status);
      instance.isInput = false;
    }
  }
});

//
// chatMessageListItem
Template.chatMessageListItem.onRendered(function () {
  // scroll to bottom of main div
  var selector = '.chat-view > main';
  ScrollToBottom(selector);
});

Template.chatMessageListItem.helpers({
  isDate: function (type) {
    return type === "date";
  },

  isUserMessage: function (from_id) {
    return Meteor.userId() === from_id ? true : false;
  }
});

//
// chatStatusListItem
Template.chatStatusInput.onRendered(function () {
  // scroll to bottom of main div
  var selector = '.chat-view > main';
  ScrollToBottom(selector);
});

Template.chatStatusInput.helpers({

  onTyping: function () {
    var result = ChatStatus.find({ "to._id": Meteor.userId() }).count();
    return result > 0 ? true : false;
  }

});
