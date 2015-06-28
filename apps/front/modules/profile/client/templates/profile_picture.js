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

var cropperDeps = new Tracker.Dependency;

var _drawCropper = function() {
  cropperDeps.depend();
  var user = Meteor.user();
  var flag = myPicState(user);

  var url = _editPic(user);
  var $avatarView = $('#avatarPreview');

  if (flag === 'both')
    $avatarView.cropper('destroy').cropper();

  if (flag === 'onlyTemp') {
    $avatarView.cropper('replace', url);
  }

  if (flag === 'onlyOrigin') {
    if ($avatarView && $avatarView[0] && $avatarView[0].src)
      $avatarView[0].src = url;

    var canvasData = {
      left: user.profile.picture.coordinates.left,
      top: user.profile.picture.coordinates.top,
      width: user.profile.picture.coordinates.width,
      height: user.profile.picture.coordinates.height
    };
    var rotateData = {
      rotate: user.profile.picture.coordinates.rotate
    };
    var cropBoxData;

    $avatarView.cropper('destroy').cropper({
      built: function() {
        $avatarView.cropper('setCropBoxData', cropBoxData);
        $avatarView.cropper('setCanvasData', canvasData);
        $avatarView.cropper('setData', rotateData);
      }
    });
  }
};

Template.profilePicture.helpers({
  picUrl: function() {
    var user = Meteor.user();
    var result = _editPic(user);

    return result;
  },

  userInitial: function() {
    return _userInitial();
  },

  isSetImage: function() {
    return Session.get('isSetImage');
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
      return $('#profileModal').modal('hide');

    var profileObj = {};
    var cropData = $avatarView.cropper('getData');
    var canvasData = $avatarView.cropper('getCanvasData');

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

    $('#profileModal').modal('hide');

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

    Meteor.call('updateCroppedImage', profileObj, flag, function (error, result) {
      if (error) console.log('error reason: ', error.reason);
      console.log(result);

      cropperDeps.changed();
    });
  }

  //"click #rotateLeft": function(){
  //  var flag = profilePictureState();
  //  if (flag !== 0) {
  //    $('#avatarPreview').cropper('rotate', -90);
  //
  //  }
  //},
  //"click #rotateRight": function(){
  //  var flag = profilePictureState();
  //  if (flag !== 0) {
  //    $('#avatarPreview').cropper('rotate', 90);
  //
  //  }
  //}
});

Template.profilePicture.onCreated(function() {
  _removeTempPic();
});

Template.profilePicture.onRendered(function() {
  Tracker.autorun(function() {
    _drawCropper();
  });

  $('#profileModal').on('hide.bs.modal', function() {
    _removeTempPic();
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
    if (data) Session.set('isSetImage', true);

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
