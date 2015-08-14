/**
 * Created by ProgrammingPearls on 15. 8. 13..
 */

Meteor.publish('dockmessage', function (to_id) {
  return Messages.find({ $or: [{
    from_id: this.userId,
    to_id: to_id
    }, {
    from_id: to_id,
    to_id: this.userId
    }]
  });
});
