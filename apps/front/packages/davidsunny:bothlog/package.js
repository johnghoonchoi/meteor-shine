Package.describe({
  name: 'davidsunny:bothlog',
  version: '0.0.1',
  summary: 'test package..',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.addFiles('bothlog.js', 'client');
  api.addFiles('serverbothlog.js', 'server');

  if (api.export) {
    api.export('BothLog');
  }
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('davidsunny:bothlog');
  api.addFiles('bothlog-tests.js');
});

Npm.depends({
  "colors": "0.6.2"
});
