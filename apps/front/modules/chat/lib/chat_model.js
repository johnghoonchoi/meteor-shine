/**
 * Created by ProgrammingPearls on 15. 8. 13..
 */

ChatMessages = new Mongo.Collection('chatMessages');

Meteor.methods({
  chatMessageInsert : function (data) {

    // check validation
    check(data, Object);

    // check permission

    // build insert object
    var chatMessage = {
      from: {
        _id: Meteor.userId(),
        username: Meteor.user().username
      },
      to: {
        _id: data.receiveId,
        username: userDisplayName(data.receiveId)
      },
      content: data.content,
      createdAt: new Date(),
      type: data.type
    };

    // insert and return _id
    try {
      chatMessage._id = ChatMessages.insert(chatMessage);

      return chatMessage._id;

    } catch (ex) {
      console.error('err', ex);
      return null;
    }

  }
});

ChatStatus = new Mongo.Collection('chatStatus');

Meteor.methods({
  chatStatusInsert : function (data) {

    // check validation
    check(data, Object);

    // check permission

    // build insert object
    var chatMessage = {
      from: {
        _id: Meteor.userId()
      },
      to: {
        _id: data.receiveId
      },
      status : "input"
    };

    // insert and return _id
    try {
      chatMessage._id = ChatStatus.insert(chatMessage);

      return chatMessage._id;

    } catch (ex) {
      console.error('err', ex);
      return null;
    }

  },

  chatStatusRemove: function (status) {
    // check validation

    // check permission

    // build remove object
    return ChatStatus.remove({ "from._id": Meteor.userId(), "status": status});
  }
});
