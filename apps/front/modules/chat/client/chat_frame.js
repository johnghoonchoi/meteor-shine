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

  instance.getPartnerPicture = function () {
    var result = Meteor.users.findOne({_id: toId});
    return getPicture(result);
  };

  instance.partnerPicture = instance.getPartnerPicture();
});

Template.chatFrame.onDestroyed(function () {
  this.data.chatTemplate = null;

  // other side input message
  this.isInput = false;
  Meteor.call('chatStatusRemove', this.status);
});

Template.chatFrame.helpers({
  chatMessagesList: function () {
    var result = ChatMessages.find({}, { sort : { createdAt: 1 } });
    return result;
  },

  onTyping: function () {
    var result = Counts.get('chatStatusCount');
    return result > 0 ? true : false;
  }
});

Template.chatFrame.events({

  // header events
  'click a.close': function (e, instance) {
    Blaze.remove(instance.data.chatTemplate);
  },

  // footer events
  'keyup textarea': function (e, instance) {

    var thisElement = instance.find("textarea");
    var content = thisElement.value;

    // remove line breaks from string
    content = content.replace(/(\r\n|\n|\r)/gm,"");

    var toId = this.user._id;
    var data = {
      toId: toId,
      status: instance.status
    };

    // input text
    if (content.length === 0 || content === "" || content === null) {
      if (instance.isInput) {
        instance.isInput = !instance.isInput;
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
Template.chatMessageListItem.onCreated(function () {
  var instance = this;
  var parentData = this.parentInstance("chatFrame");

  instance.partnerPicture = parentData.partnerPicture;
});

Template.chatMessageListItem.onRendered(function () {
  // scroll to bottom of main div
  var selector = '.chat-message-lists';
  ScrollToBottom(selector);
});

Template.chatMessageListItem.helpers({
  isDate: function (type) {
    return type === "date";
  },

  isUserMessage: function (from) {
    return Meteor.userId() === from._id ? true : false;
  },

  getPartnerPictures: function () {
    return Template.instance().partnerPicture;
  }
});

//
// chatStatusListItem
Template.chatStatusInput.onRendered(function () {
  // scroll to bottom of main div
  var selector = '.chat-message-lists';
  ScrollToBottom(selector);
});

Template.chatStatusInput.helpers({
  getPartnerPictures: function () {
    //return Template.instance().partnerPicture;
    return getPicture(this.user);
  }
});

