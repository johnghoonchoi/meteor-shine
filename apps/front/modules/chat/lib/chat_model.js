/**
 * Created by ProgrammingPearls on 15. 8. 13..
 */

ChatMessages = new Mongo.Collection('chatMessages');

Meteor.methods({
  chatMessageInsert : function (data) {

    // check validation

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
      createdAt: new Date()
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
