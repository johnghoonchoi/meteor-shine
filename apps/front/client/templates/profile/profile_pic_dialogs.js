
Template.profilePicDialogs.helpers({
  getOriginUrl: function() {
    var user = Meteor.user();

    if (user && user.profile) {
      if (user.profile.tempUrl) {
        return user.profile.tempUrl
      } else if(user.profile.originUrl) {
        return user.profile.originUrl
      }

      return user.profile.avatarUrl
    } else {
      return "";
    }
  }

});

Template.profilePicDialogs.events({
  "click #rotateLeft": function(event, template){
    $('.avatar-wrapper > img').cropper('rotate', -90);
  },

  "click #rotateRight": function(event, template){
    $('.avatar-wrapper > img').cropper('rotate', 90);
  },

  "click #resetBtn": function() {
    $('.avatar-wrapper > img').cropper('reset');
  },

  "click #saveBtn" : function() {
    var cropData = $('#avatarPreview').cropper('getData');

    var newWidth = Math.round(cropData.width);
    var newHeight = Math.round(cropData.height);
    var newX = Math.round(cropData.x);
    var newY = Math.round(cropData.y);
    var newRotate = cropData.rotate;

    var originUrl = $('#avatarPreview')[0].src;

    var croppedImgage = $.cloudinary.fetch_image(originUrl,
      {
        crop: 'crop',
        width: newWidth,
        height: newHeight,
        x: newX,
        y: newY,
        angle: newRotate,
        fetch_format: 'png'
      });

    if(!croppedImgage) {

      console.log('fetch failed');

    } else {

      console.log('fetch success: ', croppedImgage);

      var croppedUrl = croppedImgage[0].src;
      var publicId = Meteor.user().profile.tempId;

      if(publicId === "") {
        publicId = Meteor.user().profile.publicId;
      }

      console.log('publicId: ', publicId);

      Meteor.call('updateProfileUrl', originUrl, croppedUrl, publicId);

      $('#profileModal').modal('hide');
      Router.go('profileView');
    }
  },
});

Template.profilePicDialogs.onRendered(function() {
  $('#profileModal').on('hidden.bs.modal', function () {
    $('#avatarPreview').cropper('destroy');
    Meteor.call('deleteTempUrl');
  });

  Cloudinary.uploadImagePreset({
    config: {
      cloud_name: Meteor.settings.public.cloudinary.cloudName,
      api_key: Meteor.settings.public.cloudinary.apiKey,
      presets: {
        accounts: Meteor.settings.public.cloudinary.presets.accounts,
        blogs: Meteor.settings.public.cloudinary.presets.blogs
      }
    },
    preset: Meteor.settings.public.cloudinary.presets.blogs,
    buttonHTML: '<i class="fa fa-upload">사진선택',
    showProgress: true,
    options: {
      multiple: false
    }
  }, function(e, data) {

    var tempId = data.result.public_id;
    var tempUrl = data.result.url;
    var cropBoxData = {};

    cropBoxData.width = 270;
    cropBoxData.height = 270;

    $('#avatarPreview').cropper({
      aspectRatio: 1/1,
      autoCropArea: 1,
      strict: false,
      guides: true,
      responsive: false,
      background: false,
      modal: false,
      highlight: false,
      dragCrop: false,
      movable: false,
      resizable: false,
      rotatable: true,
      preview: '.avatar-preview',
      built: function() {
        // Strict mode: set crop box data first
        $('#avatarPreview').cropper('setCropBoxData', cropBoxData);
      },
    });

    $('#avatarPreview').cropper('replace', tempUrl);

    var userId = Meteor.user()._id;

    console.log('original image upload done');

    Meteor.call('uploadOriginImage', tempId, tempUrl, userId);
  });

});
