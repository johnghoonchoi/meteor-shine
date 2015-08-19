/**
 * Created by ProgrammingPearls on 15. 8. 13..
 */

Meteor.publish('chatMessages', function (receiveId) {

  var senderQuery = { "from._id" : this.userId, "to._id": receiveId };
  var receiverQuery = { "from._id" : receiveId, "to._id": this.userId };

  var query = { $or: [ senderQuery, receiverQuery ]};

  return ChatMessages.find(query);
});


