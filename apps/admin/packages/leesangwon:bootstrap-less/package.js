Package.describe({
  name: 'leesangwon:bootstrap-less',
  version: '0.9.0',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.3.1');

  api.use('jquery', 'client');
  api.imply(['less']);

  api.addFiles('bootstrap-less.js');

  api.addFiles('3.3.4/js/transition.js', 'client');
  api.addFiles('3.3.4/js/alert.js', 'client');
  api.addFiles('3.3.4/js/button.js', 'client');
  api.addFiles('3.3.4/js/carousel.js', 'client');
  api.addFiles('3.3.4/js/collapse.js', 'client');
  api.addFiles('3.3.4/js/dropdown.js', 'client');
  api.addFiles('3.3.4/js/modal.js', 'client');
  api.addFiles('3.3.4/js/tooltip.js', 'client');
  api.addFiles('3.3.4/js/popover.js', 'client');
  api.addFiles('3.3.4/js/scrollspy.js', 'client');
  api.addFiles('3.3.4/js/tab.js', 'client');
  api.addFiles('3.3.4/js/affix.js', 'client');


  api.addFiles('3.3.4/fonts/glyphicons-halflings-regular.eot', 'client', { isAsset: true });
  api.addFiles('3.3.4/fonts/glyphicons-halflings-regular.svg', 'client', { isAsset: true });
  api.addFiles('3.3.4/fonts/glyphicons-halflings-regular.ttf', 'client', { isAsset: true });
  api.addFiles('3.3.4/fonts/glyphicons-halflings-regular.woff', 'client', { isAsset: true });
  api.addFiles('3.3.4/fonts/glyphicons-halflings-regular.woff2', 'client', { isAsset: true });

  api.addFiles('bookpal.png', 'client', { isAsset: true });

});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('leesangwon:bootstrap-less');
  api.addFiles('bootstrap-less-tests.js');
});
