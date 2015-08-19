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

  instance.latelyDate = function () {
    return ChatMessages.findOne({ "type": "date" }, { sort: { createdAt: -1 }});
  };

});

Template.chatFrame.onDestroyed(function () {
  this.data.chatView = null;
  this.isStatus = false;
  if (this.status_id) delete this.status_id;
});

Template.chatFrame.helpers({
  chatMessagesList: function () {
    return ChatMessages.find({}, { sort : { createdAt: 1 } });
  }
});

Template.chatFrame.events({
  // header events
  'click a.chat-minimize': function (e, instance) {
    e.preventDefault();

  },

  'click a.chat-exit': function (e, instance) {

    e.preventDefault();
    var data = instance.data;

    Blaze.remove(data.chatView);
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

    var receivedId = this.user._id;
    var data = {};

    // input text
    if (content.length === 0 || content === "" || content === null) {
      console.log('remove.status_id', instance.status_id);
      if(instance.isStatus) {
        instance.isStatus = !instance.isStatus;

        Meteor.call('chatMessageRemove', instance.status_id);
        delete instance.status_id;
      }
      return;
    } else {
      data = {
        receiveId: receivedId,
        type: "status"
      };

      if (!instance.isStatus) {
        instance.isStatus = !instance.isStatus;

        Meteor.call('chatMessageInsert', data, function (err, result) {
          if (err) console.error('err', err);

          instance.status_id = result;
          console.log('insert.status_id', instance.status_id);
        });
      }
    }

    // input enter
    if (e.which === 13) {

      e.stopPropagation();
      e.preventDefault();

      // clear textarea
      thisElement.value = "";

      // lately date to less than 2 minutes date.
      var latelyDate = instance.latelyDate();

      if (latelyDate) {
        var diffSecond = Math.abs(new Date() - latelyDate.createdAt) / 1000;
        var diffMinute = diffSecond / 60;
        var diffHours = diffMinute / 60;
        var diffDays = diffHours / 24;
      }

      if (!latelyDate || diffMinute > 2) {
        // insert message (type=date)
        data = {
          receiveId: receivedId,
          type: "date"
        };
        Meteor.call('chatMessageInsert', data);
      }

      if (content.length ===0 || content === "" || content === null) return;

      var data = {
        content: content,
        type: "msg"
      };

      // update message (type=msg)
      Meteor.call('chatMessageUpdate', instance.status_id, data);

      instance.isStatus = false;
      delete instance.status_id;
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
  isFromMessage: function (from_id) {
    return Meteor.userId() === from_id ? true : false;
  },

  isDate: function (type) {
    return type === "date";
  },

  isStatus: function (type) {
    return type === "status";
  }
});
