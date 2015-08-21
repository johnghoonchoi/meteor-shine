/**
 * Created by ProgrammingPearls on 15. 8. 13..
 */

Meteor.publish('chatMessages', function (receiveId, limit) {

  var senderQuery = { "from._id" : this.userId, "to._id": receiveId };
  var receiverQuery = { "from._id" : receiveId, "to._id": this.userId };

  var query = { $or: [ senderQuery, receiverQuery ]};

  limit = limit || 0;

  return ChatMessages.find(query, { limit: limit });
});

Meteor.publish('chatStatus', function (receiveId, status) {

  var senderQuery = { "from._id" : this.userId, "to._id": receiveId, "status": status };
  var receiverQuery = { "from._id" : receiveId, "to._id": this.userId, "status": status };

  var query = { $or: [ senderQuery, receiverQuery ]};

  return ChatStatus.find(query);
});

// how to remove Duplicate source?
