/**
 * Created by ProgrammingPearls on 15. 8. 13..
 */

Messages = new Mongo.Collection('messages');

Meteor.methods({
  'messageInput' : function (data) {

    var message = {
      from: Meteor.user().username,
      from_id: Meteor.userId(),
      to: userDisplayName(data.to_id),
      to_id: data.to_id,
      text: data.text,
      regdateAt: Date.now()
    };
    return Messages.insert(message);
  }
});
