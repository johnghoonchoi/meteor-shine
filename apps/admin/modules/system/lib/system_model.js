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
        var id = object._id;

        object = _.extend(_.omit(object, '_id'), {
          workBy: {
            _id: user._id,
            username: user.username,
            name: user.name
          },
          updatedAt: now
        });

        Systems.update({ _id: id }, { $set: object });
      }
    }
  },

  systemLogoUpsert: function(object) {
    var prepareImageData = function(data) {
      var user = Meteor.user();

      return _.extend(_.pick(data, 'url', 'surl', 'size', 'width', 'height',
        'urlFit', 'surlFit', 'widthFit', 'heightFit',
        'ext', 'mime', 'original', 'repoId'), {
        user: {
          _id: user._id,
          username: user.username,
          name: user.name
        },
        createdAt: new Date()
      });
    };

    var saved = Systems.findOne({ _id: 'logo' });

    var image = prepareImageData(object);

    if (saved) {
      var removed = Systems.remove({ _id: 'logo' });

      if (removed > 0) {
        cloudinaryRemoveImage(image.repoId);
      }

      return Systems.update({ _id: 'logo' }, { $set: image })
    } else {
      image = _.extend({ _id: 'logo'}, image);

      return Systems.insert(image);
    }
  }
});
