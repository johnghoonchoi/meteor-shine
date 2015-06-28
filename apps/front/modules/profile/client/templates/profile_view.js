/**
 * Display user information
 *    - picture
 *    - profile
 */

var TEMPLATE_PROFILE = 'templateProfile';
var EDIT_PASSWORD = 'editPassword';

Template.profileView.helpers({
  templateProfile: function() {
    return Session.get(TEMPLATE_PROFILE) || 'profileEditNormal';
  },

  editPassword: function() {
    return Session.get(EDIT_PASSWORD) || false;
  }

});
Template.profileView.events({

  "click #editPicture, click .avatar-wrapper-custom img, click .avatar-initials": function(e) {
    e.preventDefault();
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


Template.profileView.onCreated(function() {
  this._profilePictureView = Blaze.render(Template.profilePicture, document.body);
});

Template.profileView.onRendered(function() {
});

Template.profileView.onDestroyed(function() {
  if (this._profilePictureView) {
    Blaze.remove(this._profilePictureView);
    this._profilePictureView = null;
  }
});
