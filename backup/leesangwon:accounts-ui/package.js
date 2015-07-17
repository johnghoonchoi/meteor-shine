Package.describe({
  name: 'leesangwon:accounts-ui',
  summary: 'Accounts ui',
  version: '0.6.2',
  git: 'https://github.com/miraten/meteor-accounts-ui'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  api.use([
    'accounts-base',
    'sha',
    'email',
    'iron:router@1.0.0',
    'leesangwon:mira-validator@0.4.1'
  ]);

  api.use([
    'tracker',
    'service-configuration',
    'underscore',
    'templating',
    'mongo-livedata',
    'leesangwon:alerts@0.5.0',
    'sacha:spin@2.0.4',
    'session'], 'client');

  // Allow us to call Accounts.oauth.serviceNames, if there are any OAuth
  // services.
  api.use('accounts-oauth', {weak: true});
  // Allow us to directly test if accounts-password (which doesn't use
  // Accounts.oauth.registerService) exists.
  api.use('accounts-password', {weak: true});

  api.addFiles([
    'shared/accounts_ui.js',
    'shared/router.js'
  ]);

  api.addFiles([
    'client/accounts_dialogs.html',
    'client/sign_in.html',
    'client/sign_up.html',
    'client/forgot_password.html',
    'client/verify_email.html',
    'client/reset_password.html',
    'client/login_services.html',

    'client/login_sessions.js',
    'client/accounts_dialogs.js',
    'client/sign_in.js',
    'client/sign_up.js',
    'client/forgot_password.js',
    'client/reset_password.js',
    'client/accounts_errors.js',
    'client/login_services.js'
  ], 'client');

  api.addFiles([
    'server/accounts_methods.js'
  ], 'server');

});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('leesangwon:accounts-ui');
  api.addFiles('accounts_ui_tests.js', 'client');
});
