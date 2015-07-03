Images = new Mongo.Collection('images');

var prepareData = function(attributes) {
  var user = Meteor.user();

  return _.extend(_.pick(attributes, 'url', 'surl', 'size', 'width', 'height',
    'urlFit', 'surlFit', 'widthFit', 'heightFit',
    'ext', 'mime', 'original', 'repoId'), {
    user: {
      _id: user._id,
      username: user.username,
      //name: user.profile.name
    },
    createdAt: new Date()
  });
};

Meteor.methods({
/*
  cloudinaryUploadTag: function() {
    return CloudinaryServer.uploadTag();
  },
*/
	"cImageUploadSave" :function(attributes){
		check(attributes, Match.Any)

		var image = prepareData(attributes);

		image._id = Images.insert(image);

		return image._id;
	},

  "defaultProfile": function() {
    Meteor.users.update(Meteor.userId(),
    {
      $set: {
          "profile.avatarUrl": "/images/default_profile.png",
          "profile.tempUrl": "",
          "profile.tempId": "",
          "profile.originUrl": "",
          "profile.publicId": "",
          "profile.position.left": 0,
          "profile.position.top": 10,
          "profile.position.width": 280,
          "profile.position.height": 280,
      }
    });
  },

  "uploadOriginImage" : function(publicId, originUrl) {
    Meteor.users.update(Meteor.userId(),
    {
      $set: {
          "profile.tempId": publicId,
          "profile.tempUrl": originUrl,
      }
    });
  },

  "updateProfileUrl" : function(originUrl, croppedUrl, publicId, canvasData) {
    return Meteor.users.update(Meteor.userId(),
      { $set:
        { "profile.originUrl": originUrl,
          "profile.avatarUrl": croppedUrl,
          "profile.publicId": publicId,
          "profile.tempUrl": "",
          "profile.tempId": "",
          "profile.position": canvasData
        }
      });
  },

  // 'deleteTempUrl' : function() {
  //   Meteor.users.update(Meteor.userId(),
  //     { $set:
  //       {
  //         "profile.tempUrl": "",
  //         "profile.tempId": ""
  //       }
  //     });
  // },

});
