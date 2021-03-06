Package.describe({
  name: 'leesangwon:alerts',
  summary: 'A package for displaying alert message box for Meteor JS',
  version: '0.5.2',
  git: 'https://github.com/miraten/meteor-alerts'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  api.use([
    'minimongo',
    'mongo-livedata',
    'templating',
    'underscore',
    'less@2.5.0-rc.2_1',
    'leesangwon:bootstrap-less',
    'leesangwon:i18n@0.9.0'
  ], 'client');

  api.addFiles([
    'client/alerts.js',
    'client/alerts.less',
    'client/notification-templates.html',
    'client/notification-templates.js',
    'client/dialog-templates.html',
    'client/dialog-templates.js',
  ], 'client');

  api.export('Alerts');
});

Package.onTest(function(api) {
  api.use('tinytest', 'client');
  api.use('leesangwon:alerts', 'client');
  api.addFiles('alerts-tests.js', 'client');
});
