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
  instance.onTyping = false;

  Meteor.call('chatStatusRemove', instance.status);

  // subscribe
  instance.autorun(function () {
    instance.chatMessages = instance.subscribe('chatMessages', toId);
    instance.subscribe('chatStatus', toId, instance.status);

  });

  instance.autorun(function () {
    // when subscribe is ready
    if (instance.chatMessages.ready()) {
      var result = Meteor.users.findOne({_id: toId});
      // getPicture
      instance.partnerPicture = getPicture(result);
    }
  });

  instance.latelyDate = function () {
    return ChatMessages.findOne({}, { sort: { createdAt: -1 }});
  };

});

Template.chatFrame.onDestroyed(function () {
  chatSingleton.template = null;
  chatSingleton.userId = null;

  // other side input message
  this.onTyping = false;
  Meteor.call('chatStatusRemove', this.status);
});

Template.chatFrame.helpers({
  chatMessagesList: function () {
      return ChatMessages.find({}, { sort : { createdAt: 1 } });
  },

  onTyping: function () {
    return Counts.get('chatStatusCount') > 0 ? true : false;
  }
});

Template.chatFrame.events({

  // header events
  'click a.close': function (e) {
    Blaze.remove(chatSingleton.template);
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
      if (instance.onTyping) {
        instance.onTyping = !instance.onTyping;
        Meteor.call('chatStatusRemove', instance.status);
      }

      // clear textarea
      thisElement.value = "";
      return;
    } else {
      if (!instance.onTyping) {
        instance.onTyping = !instance.onTyping;
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
      var latelyDate = instance.latelyDate() || 0;

      var inputDate = new Date();

      var diffMinutes = Math.abs(moment(latelyDate.createdAt).diff(inputDate, "minutes"));
      console.log('diffMinutes', diffMinutes);
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
      instance.onTyping = false;
    }
  }
});

//
// chatMessageListItem
Template.chatMessageListItem.onRendered(function () {
  // scroll to bottom of main div
  var selector = 'main.body';
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
    return Template.instance().parentInstance("chatFrame").partnerPicture;
  }
});

//
// chatStatusListItem
Template.chatStatusInput.onRendered(function () {
  // scroll to bottom of main div
  var selector = 'main.body';
  ScrollToBottom(selector);
});

Template.chatStatusInput.helpers({
  getPartnerPictures: function () {
    return Template.instance().parentInstance("chatFrame").partnerPicture;
  }
});
