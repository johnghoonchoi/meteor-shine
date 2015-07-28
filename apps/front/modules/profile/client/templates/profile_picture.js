/**
 *  Display window for cropping profile image
 *    -picture
 */

var _userInitial = function() {
  var user = Meteor.user();
  if (user) {
    var initial = makeUppercase(userDisplayName(user));
  }

  return "<span class='avatar-initials'>"+initial+"</span>";
}

var _editPic = function(user) {
  if (user) {
    var flag = myPicState(user); // global func defined in profile.js

    if (flag === 'onlyOrigin')
      return user.profile.picture.origin.url;
    if (flag === 'both' || flag === 'onlyTemp')
      return user.profile.picture.temp.url;

    return false;
  }
};

var _removeTempPic = function() {
  var user = Meteor.user();
  var flag = myPicState(user);
  if (flag === 'both') {
    Meteor.users.update({_id: Meteor.userId()}, {$unset: {'profile.picture.temp': 1}});
  }
  if (flag === 'onlyTemp') {
    Meteor.users.update({ _id: Meteor.userId() }, { $unset: { 'profile.picture': 1 }});
  }
  cropperDeps.changed();
};

var _stopCropper = function () {
  console.log('_stopCropper: ');
  $('#avatarModal').find('form').get(0).reset();
  $('.avatar-wrapper').find('img').cropper('destroy');
  $('.avatar-wrapper').find('img').remove();
};

var cropperDeps = new Tracker.Dependency;

var _drawCropper = function() {
  cropperDeps.depend();
  var user = Meteor.user();
  var flag = myPicState(user);
  var $avatarView = $('.avatar-wrapper');

  if (flag === 'default') {
    $avatarView.empty().html(_userInitial());
    console.log('default');

    return;
  }

  var url = _editPic(user);
  var $img = $('<img src="' + url + '" id="avatarPreview" >');
  $('.avatar-wrapper').empty().html($img);

  if (flag === 'onlyOrigin') {
    var canvasData = {
      left: user.profile.picture.coordinates.left,
      top: user.profile.picture.coordinates.top,
      width: user.profile.picture.coordinates.width,
      height: user.profile.picture.coordinates.height
    };

    var rotateData = {
      rotate: user.profile.picture.coordinates.rotate
    };
    //var cropBoxData;

    $img.cropper({
      built: function() {
        //$img.cropper('setCropBoxData', cropBoxData);
        $img.cropper('setCanvasData', canvasData);
        $img.cropper('setData', rotateData);
      }
    });

    return;
  }

  if (flag === 'both')
    $img.cropper();

  if (flag === 'onlyTemp') {
    $img.cropper();
  }

  console.log('autorun');

};

Template.profilePicture.helpers({
  picUrl: function() {
    var user = Meteor.user();
    var result = _editPic(user);

    return result;
  }
});

Template.profilePicture.events({
  "click #cancelBtn": function() {
    _removeTempPic();
  },
  "click #saveBtn" : function() {
    var user = Meteor.user();
    var flag = myPicState(user);
    var $avatarView = $('#avatarPreview');

    if (flag === 'default')
      return $('#avatarModal').modal('hide');

    var profileObj = {};
    var cropData = $avatarView.cropper('getData');
    var canvasData = $avatarView.cropper('getCanvasData');

    $('#avatarModal').modal('hide');

    if (flag === 'onlyOrigin') {
      profileObj._id = user.profile.picture.origin._id;
      profileObj.repoId = user.profile.picture.origin.repoId;
      profileObj.url = user.profile.picture.origin.url;
    }

    if (flag === 'onlyTemp' || flag === 'both') {
      profileObj._id = user.profile.picture.temp._id;
      profileObj.repoId = user.profile.picture.temp.repoId;
      profileObj.url = user.profile.picture.temp.url;
    }

    cropData.width = Math.round(cropData.width);
    cropData.height = Math.round(cropData.height);
    cropData.x = Math.round(cropData.x);
    cropData.y = Math.round(cropData.y);
    cropData.rotate = Math.round(cropData.rotate);

    canvasData.left = Math.round(canvasData.left);
    canvasData.top = Math.round(canvasData.top);
    canvasData.width = Math.round(canvasData.width);
    canvasData.height = Math.round(canvasData.height);

    profileObj.cropData = cropData;
    profileObj.canvasData = canvasData;

    //$cropAvatar.cropDone();

    Meteor.call('updateCroppedImage', profileObj, flag, function (error, result) {
      if (error) console.log('error reason: ', error.reason);
      console.log(result);

      cropperDeps.changed();
    });
  }
});

Template.profilePicture.onCreated(function() {
  _removeTempPic();
});

Template.profilePicture.onRendered(function() {
  Tracker.autorun(function() {
    _drawCropper();
  });

  $('#avatarModal').on('hide.bs.modal', function() {
    _removeTempPic();
    _stopCropper();
  });

});

Template.profilePictureToolbar.onRendered(function() {
  // clicks upload button
  // shows window for selecting an image
  // select an image and then this method call
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
    buttonHTML: '<i class="fa fa-upload">',
    showProgress: true,
    options: {
      multiple: false
    }
  }, function(e, data) {

    var attributes = {
      url: data.result.url,
      surl: data.result.secure_url,
      size: data.result.bytes,
      width: data.result.width,
      height: data.result.height,
      ext: data.result.format,
      mime: data.originalFiles[0].type,
      original: data.originalFiles[0].name,
      repoId: data.result.public_id
    };

    Meteor.call('profileImagesInsert', attributes, function(error, result) {
      if (error) console.log('error reason: ', error.reason);
      console.log(result);

      cropperDeps.changed();
    });
  });

});
