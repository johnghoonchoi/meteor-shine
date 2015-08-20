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
  var receiveId = data.user._id;

  instance.status = "input";
  instance.isInput = false;
  instance.limit = 5;
  instance.increment = new ReactiveVar(1);


  // subscribe
  instance.autorun(function () {
    var limit = instance.limit.get();
    var increment = instance.increment.get();
    instance.subscribe('chatMessages', receiveId);

    instance.subscribe('chatStatus', receiveId, instance.status);

    instance.chatMessagesList = function () {
      return ChatMessages.find({}, { sort : { createdAt: 1 }, limit : limit * increment });
    };
  });

  // collection
  instance.latelyDate = function () {
    return ChatMessages.findOne({ "type": "date" }, { sort: { createdAt: -1 }});
  };

  instance.chatStatusList = function () {
   return ChatStatus.find({});
  };

  Meteor.call('chatStatusRemove', instance.status);
});

Template.chatFrame.onDestroyed(function () {
  // initialize
  this.data.chatTemplate = null;
  this.isInput = false;
  Meteor.call('chatStatusRemove', this.status);
});

Template.chatFrame.helpers({
  chatMessagesList: function () {
    return Template.instance().chatMessagesList();
  },

  chatStatusList: function () {
    return Template.instance().chatStatusList();
  }
});

Template.chatFrame.events({

  // header events
  'click a.chat-minimize': function (e, instance) {
    e.preventDefault();
    e.stopPropagation();

  },

  'click a.chat-exit': function (e, instance) {

    e.stopPropagation();
    e.preventDefault();
    var data = instance.data;

    Blaze.remove(data.chatTemplate);

    //if (instance.isInput) {
    //  instance.isInput = !instance.isInput;
    //  Meteor.call('chatStatusRemove', instance.status);
    //}
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

    var receiveId = this.user._id;
    var data = {
      receiveId: receiveId
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
          receiveId: receiveId,
          type: "date"
        };
        Meteor.call('chatMessageInsert', data);
      }

      //if (content.length ===0 || content === "" || content === null) return;

      var data = {
        receiveId: receiveId,
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
//
// chatMessageList
Template.chatMessageListItem.onRendered(function () {

  // scroll to bottom of main div
  var selector = '.chat-view > main';
  ScrollToBottom(selector);

});

Template.chatMessageListItem.helpers({
  isDate: function (type) {
    return type === "date";
  },

  isFromMessage: function (from_id) {
    return Meteor.userId() === from_id ? true : false;
  }
});


//
//
// chatStatusList
Template.chatStatusListItem.onRendered(function () {
  // scroll to bottom of main div
  var selector = '.chat-view > main';
  ScrollToBottom(selector);
});

Template.chatStatusListItem.helpers({

  isFromMessage: function (from_id) {
    return Meteor.userId() === from_id ? true : false;
  }

});
