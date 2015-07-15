Meteor.Spinner.options = {
  lines: 13, // The number of lines to draw
  length: 1, // The length of each line
  width: 6, // The line thickness
  radius: 15, // The radius of the inner circle
  corners: 1, // Corner roundness (0..1)
  rotate: 0, // The rotation offset
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#fff', // #rgb or #rrggbb
  speed: 1, // Rounds per second
  trail: 64, // Afterglow percentage
  shadow: true, // Whether to render a shadow
  hwaccel: false, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  top: '50%', // Top position relative to parent in px
  left: '50%' // Left position relative to parent in px
};

// Default settings for Cropper
$.fn.cropper.setDefaults({
  aspectRatio: 1/1,
  autoCropArea: 1,
  strict: true,
  guides: false,
  responsive: true,
  background: false,
  highlight: false,
  dragCrop: false,
  crossOrigin: true,
  cropBoxResizable: false,
  cropBoxMovable: false
});

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});
