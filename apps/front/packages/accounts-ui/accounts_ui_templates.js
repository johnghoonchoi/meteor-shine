
Accounts.ui.render = function(template) {
  Blaze.renderWithData(Template.accountsUIModal,
    { activeTemplate: template }, document.body);
};

Template.accountsUIModal.onRendered(function() {
  $('#accountsUIModal').modal();
});

Template.accountsUIModal.helpers({
  activeTemplate: function() {
    return this.activeTemplate;
  }
});

