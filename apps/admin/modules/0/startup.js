
Meteor.startup(function() {

  I18n.init();
  I18n.loadLanguage("en", 'I18n_data_en');
  I18n.loadLanguage("en", 'I18n_data_en_accounts', 'accounts');
  I18n.loadLanguage("ko", 'I18n_data_ko');
  I18n.loadLanguage("ko", 'I18n_data_ko_accounts', 'accounts');

  I18n.setLanguage("ko");

});

