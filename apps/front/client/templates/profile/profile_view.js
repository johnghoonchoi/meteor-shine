/**
 * Display user information
 *    - picture
 *    - profile
 */

var TEMPLATE_PROFILE = 'templateProfile';
var EDIT_PASSWORD = 'editPassword';

Template.profileView.helpers({
  getAvatarUrl: function() {
    var user = Meteor.user();
    return user.profile.avatarUrl
  },

  templateProfile: function() {
    return Session.get(TEMPLATE_PROFILE) || 'profileEditNormal';
  },

  editPassword: function() {
    return Session.get(EDIT_PASSWORD) || false;
  }

});

Template.profileView.events({

  "click #editPicture": function() {
    // alert('test');
    // set Cropperjs's options

    // Default crop box data property setting
    var cropBoxData = {};
    cropBoxData.width = 270;
    cropBoxData.height = 270;

    $('#avatarPreview').cropper({
      aspectRatio: 1/1,
      autoCropArea: 1,
      strict: false,
      responsive: false,
      background: false,
      highlight: false,
      dragCrop: false,
      movable: false,
      resizable: false,
      preview: '.avatar-preview',
      built: function() {
        // Strict mode: set crop box data first
        $('#avatarPreview').cropper('setCropBoxData', cropBoxData);
      },
    });

    $('#profileModal').modal('show');
  },

  'click #editProfile': function() {
    var template = Session.get(TEMPLATE_PROFILE);
    if (template === 'profileEditForm')
      Session.set(TEMPLATE_PROFILE, 'profileEditNormal');
    else
      Session.set(TEMPLATE_PROFILE, 'profileEditForm');
  },

  'click #editPassword': function() {
    var edit = Session.get(EDIT_PASSWORD);
    Session.set(EDIT_PASSWORD, ! edit);
  }
});

Template.profileView.onRendered(function() {
  // click upload button, so show pop up window for selecting an image
  // set Cropperjs
  // Listen modal's `show` and `hide` events

  $('#profileModal').on('hidden.bs.modal', function () {
    $('#avatarPreview').cropper('destroy');
  });

  // code here for upload profile photo to cloudinary server
  // using jquery file upload & cloudinary
  $('#saveBtn').on('click', function() {
    var cropData = $('#avatarPreview').cropper('getData');

    var newWidth = Math.round(cropData.width);
    var newHeight = Math.round(cropData.height);
    var newX = Math.round(cropData.x);
    var newY = Math.round(cropData.y);
    var newRotate = cropData.rotate;

    var originUrl = $('#avatarPreview')[0].src;

    var fetchedImgage = $.cloudinary.fetch_image(originUrl,
      {
        crop: 'crop',
        width: newWidth,
        height: newHeight,
        x: newX,
        y: newY,
        angle: newRotate,
        fetch_format: 'png'
      });

    if (! fetchedImgage) {

      console.log('fetch failed');

    } else {

      console.log('fetch success');

      var croppedUrl = fetchedImgage[0].src;
      var user = Meteor.user();
      var publicId = user.profile.tempId;

      console.log('publicId: ', publicId);

      Meteor.call('updateProfileUrl', originUrl, croppedUrl, publicId);

      $('#profileModal').modal('hide');
      Router.go('profileView');
    }
  });

/*
  Cloudinary.uploadImagePreset({
    config: {
    cloud_name: Meteor.settings.public.cloudinary.cloudName,
    api_key: Meteor.settings.public.cloudinary.apiKey,
    presets: {
    accounts: Meteor.settings.public.cloudinary.presets.accounts,
    blogs: Meteor.settings.public.cloudinary.presets.blogs
    }
    },
    preset: Meteor.settings.public.cloudinary.presets.accounts,
    /*
    config: {
      cloud_name: Meteor.settings.public.cloudinary.cloudName,
      api_key: Meteor.settings.public.cloudinary.apiKey
    },
    buttonHTML: '<i class="fa fa-upload">사진선택',
    showProgress: true,
    options: {
      multiple: false
    }
  }, function(e, data) {
    // $('#profileModal').modal('show');
    // this is modal's img element
    // $('.avatar-preview').resetPreview();

    // $('#avatarPreview').src = data.result.url;
    // var img = $('#avatarPreview')[0];
    // img.src = data.result.url;

    var tempId = data.result.public_id;
    var tempUrl = data.result.url;

    $('#avatarPreview').cropper('replace', tempUrl);

    var userId = Meteor.user()._id;

    console.log("tempId: ", tempId);
    console.log('original image upload done');

    Meteor.call('uploadOriginImage', tempId, tempUrl, userId);


    $('#avatarPreview').cropper({
      aspectRatio: 1 / 1,
      autoCropArea: 0.85,
      strict: false,
      guides: false,
      background: false,
      modal: false,
      // highlight: false,
      // dragCrop: false,
      // movable: false,
      // resizable: false,
      preview: '.avatar-preview'
    });
  });
*/
});

