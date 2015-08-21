
Meteor.startup(function() {

  I18n.loadLanguage("en", 'I18n_data_en');
  I18n.loadLanguage("ko", 'I18n_data_ko');

  I18n.init();
  I18n.setLanguage("ko");

  Blaze.TemplateInstance.prototype.parentInstance = function (templateName) {
    if (!/^Template\./.test(templateName))
      templateName = 'Template.' + templateName;
    var view = this.view;
    while (view = view.parentView)
      if (view.name === templateName)
        return view.templateInstance();
  }

});

