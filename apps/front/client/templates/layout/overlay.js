var PAGE_OVERLAY = 'page-overlay';
/*
PageOverlay = {
  show: function(templateName, callback) {

    Accounts.ui.activeTemplate.set(templateName);

    if (! Accounts.ui.view) {
      Accounts.ui.view = Blaze.render(Template.accountsUIOverlay, document.body);
    }

    $('#accounts-ui-overlay').fadeIn('slow');

    if (callback && typeof callback === 'function') {
      callback();
    }
  },

  hide: function() {
    $('#accounts-ui-overlay').fadeOut('slow', function() {
      if (Accounts.ui.view) {
        Blaze.remove(Accounts.ui.view);
        Accounts.ui.view = null;
      }
    });
  }
};
*/

Template.pageOverlay.onCreated(function() {
  var instance = this;

  instance.activeTemplate = new ReactiveVar();

  instance.$(PAGE_OVERLAY).fadeIn('slow');
});

Template.pageOverlay.onDestroyed = function() {
  instance.$(PAGE_OVERLAY).fadeOut('slow');
};

Template.pageOverlay.helpers({
  activeTemplate: function() {
    return Template.instance().activeTemplate;
  }
});
