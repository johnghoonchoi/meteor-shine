
'use strict';

Package.describe({
  name: 'davidsunny:accounts-meld',
  version: '0.0.1',
  summary: 'Meteor package to link/meld user accounts registered ' +
  'with the same (verified) email address.',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom("METEOR@1.0.4");

  api.use([
    'accounts-base',
    'check',
    'underscore',
    'davidsunny:accounts-emails-field'
  ], ['server']);

  api.addFiles([
    'lib/_globals.js',
    'lib/accounts-meld-server.js',
    'lib/accounts-meld-hooks.js'
  ], ['server']);

  api.imply([
    'accounts-base'
  ], ['server']);

  api.export([
    'AccountsMeld',
    'MeldActions'
  ], ['server']);
});


Package.onTest(function(api) {
  api.use('davidsunny:accounts-meld');

  api.use([
    'accounts-base',
    'accounts-oauth',
    'accounts-password',
    'http',
    'oauth',
    'oauth2',
    'oauth-encryption',
    'random',
    'service-configuration',
    'srp',
    'test-helpers',
    'tinytest',
    'underscore'
  ], ['client', 'server']);

  api.addFiles([
    'tests/accounts-meld_tests.js'
  ], ['client', 'server']);
});
