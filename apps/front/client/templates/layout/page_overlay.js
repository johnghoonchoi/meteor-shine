/*
var PAGE_OVERLAY = 'page-overlay';

PageOverlay = {

  show: function(templateName, callback) {
    var self = this;

    self.view = Blaze.render(Template.pageOverlay, document.body);

    Accounts.ui.activeTemplate.set(templateName);

    instance.$(PAGE_OVERLAY).fadeIn('slow');

    if (callback && typeof callback === 'function') {
      callback();
    }
  },

  hide: function() {
    var self = this;

    $(PAGE_OVERLAY).fadeOut('slow', function() {
      if (self.view) {
        Blaze.remove(self.view);
        self.view = null;
      }
    });
  }
};


Template.pageOverlay.onCreated(function() {
  var instance = this;

  instance.activeTemplate = new ReactiveVar('pageOverlayDefault');

});

Template.pageOverlay.onDestroyed = function() {
  instance.$(PAGE_OVERLAY).fadeOut('slow');
};

Template.pageOverlay.helpers({
  overlayTemplate: function() {
    return Template.instance().activeTemplate;
  }
});
*/
