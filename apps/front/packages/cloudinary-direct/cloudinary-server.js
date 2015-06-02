var cloudinary = Npm.require('cloudinary');
var Fiber = Npm.require('fibers');
var Future = Npm.require('fibers/future');

/**
 * cloudinary configuration
 */
cloudinary.config({
  cloud_name: Meteor.settings.public.cloudinary.cloudName,
  api_key: Meteor.settings.public.cloudinary.apiKey,
  api_secret: Meteor.settings.cloudinary.apiSecret,
});

var cloudinary_cors = Meteor.absoluteUrl('upload/cloudinary_cors.html');

Meteor.methods({
  cloudinaryUploadTag: function(elementId, options) {
    options = _.extend(options, { callback: cloudinary_cors })
    return cloudinary.uploader.image_upload_tag(elementId, options);
  },
  // http://cloudinary.com/documentation/node_image_upload
  removeImage: function(imageId) {
    var future = new Future();

    cloudinary.uploader.destroy(imageId, function(result) {
      future.return(result);
    });

    return future.wait();
  },

  cloudinaryImageCrop: function(publicId, cropData) {
    return cloudinary.url( publicId,
    {
      transformation: {
        crop: 'crop',
        width: cropData.width,
        height: cropData.height,
        x: cropData.x,
        y: cropData.y
      },
      angle: cropData.rotate
    })
  }

});

CloudinaryServer = {
  removeImage: function(imageId) {
    var future = new Future();

    cloudinary.uploader.destroy(imageId, function(result) {
      future.return(result);
    });

    return future.wait();
  },
  updateProfileImage: function() {

  },

};
