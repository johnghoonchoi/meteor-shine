Template.profileView.onCreated(function() {
  this._profilePictureView = Blaze.render(Template.profilePicture, document.body);
});

Template.profileView.onDestroyed(function() {
  if (this._profilePictureView) {
    Blaze.remove(this._profilePictureView);
    this._profilePictureView = null;
  }
});

/**
 * Display user information
 *    - picture
 *    - profile
 */

var TEMPLATE_PROFILE = 'templateProfile';

Template.profileView.helpers({
  templateProfile: function() {
    return Session.get(TEMPLATE_PROFILE) || 'profileEditNormal';
  }
});

Template.profileView.events({

  "click #editPicture, click .view-avatar img, click .avatar-initials": function(e) {
    e.preventDefault();
    $('#avatarModal').modal('show');
    //var cropInstance = new CropAvatar();
    //cropInstance.init();
    //cropInstance.click();
  },

  'click #changePassword': function(e) {
    e.preventDefault();

    Accounts.ui.dialog.show('changePassword');
  },

  'click #editProfile': function() {
    var template = Session.get(TEMPLATE_PROFILE);
    if (template === 'profileEditForm')
      Session.set(TEMPLATE_PROFILE, 'profileEditNormal');
    else
      Session.set(TEMPLATE_PROFILE, 'profileEditForm');
  }
});


