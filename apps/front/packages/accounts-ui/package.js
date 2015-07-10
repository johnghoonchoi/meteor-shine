Package.describe({
  name: 'leesangwon:accounts-ui',
  version: '0.7.0',
  summary: 'Accounts-ui for Meteor application',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  api.use([
    'tracker',
    'service-configuration',
    'accounts-base',
    'underscore',
    'templating',
    'session'
  ], 'client');

  // Export Accounts (etc) to packages using this one.
  api.imply('accounts-base', ['client', 'server']);

  // Allow us to call Accounts.oauth.serviceNames, if there are any OAuth
  // services.
  api.use('accounts-oauth', {weak: true});
  // Allow us to directly test if accounts-password (which doesn't use
  // Accounts.oauth.registerService) exists.
  api.use('accounts-password', {weak: true});

  api.addFiles([
    'accounts_ui.js',

    'accounts_ui_templates.html',
    'accounts_ui_templates.js',

    'sign_in.html',
    'sign_in.js',
    'sign_up.html',
    'sign_up.js',

    'login_buttons.html',
    'login_buttons_single.html',
    'login_buttons_dropdown.html',
    'login_buttons_dialogs.html',

    'login_buttons_session.js',

    'login_buttons.js',
    'login_buttons_single.js',
    'login_buttons_dropdown.js',
    'login_buttons_dialogs.js'], 'client');

});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('leesangwon:accounts-ui');
  api.addFiles('accounts-ui-tests.js');
});
