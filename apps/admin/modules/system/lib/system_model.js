Systems = new Mongo.Collection('systems');

Meteor.methods({
  systemUpsert: function(query) {
    var objects = query;
    var now = new Date();
    var user = Meteor.user();

    for (i = 0; i < objects.length; i++) {
      var object = objects[i];
      var saved = Systems.findOne({ _id: object._id });

      if (! saved) {
        object = _.extend(object, {
          workBy: {
            _id: user._id,
            username: user.username,
            name: user.name
          },
          createdAt: now,
          updatedAt: now
        });

        Systems.insert(object);
      } else {
        object = _.extend(object, {
          workBy: {
            _id: user._id,
            username: user.username,
            name: user.name
          },
          updatedAt: now
        });

        Systems.update({ _id: query._id }, { $set: object });
      }
    }
  }

});
