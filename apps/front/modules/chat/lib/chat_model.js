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

  },

  chatMessageUpdate: function (message_id, data) {
    // check validation
    check(data, Object);
    // check permission

    // build update object
    var chatMessage = {
      content: data.content,
      createdAt: new Date(),
      type: data.type
    };

    return ChatMessages.update({_id: message_id}, {$set: chatMessage} );

  },

  chatMessageRemove: function (message_id) {
    // check validation
    check(message_id, String);
    // check permission

    // build remove object
    return ChatMessages.remove({_id: message_id});
  }
});
