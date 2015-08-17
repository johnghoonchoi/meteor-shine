/**
 * Created by ProgrammingPearls on 15. 8. 13..
 */

chatMessages = new Mongo.Collection('chatMessages');

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
      createdAt: Date.now()
    };

    // insert and return _id
    try {
      chatMessage._id = chatMessages.insert(chatMessage);

      return chatMessage._id;

    } catch (ex) {
      console.error('err', ex);
      return null;
    }

  }
});
