Package.describe({
  name: 'leesangwon:bootstrap-less',
  version: '0.9.4',
  summary: 'Bootstrap wrapper with less files',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.3.1');

  api.use('jquery', 'client');
  api.imply(['less']);

  api.addFiles([
    'bootstrap-less.js',
    '3.3.4/js/transition.js',
    '3.3.4/js/alert.js',
    '3.3.4/js/button.js',
    '3.3.4/js/carousel.js',
    '3.3.4/js/collapse.js',
    '3.3.4/js/dropdown.js',
    '3.3.4/js/modal.js',
    '3.3.4/js/tooltip.js',
    '3.3.4/js/popover.js',
    '3.3.4/js/scrollspy.js',
    '3.3.4/js/tab.js',
    '3.3.4/js/affix.js'
  ], 'client');
/*
  api.addFiles([
    'bootstrap.import.less',
    '3.3.4/less/alerts.import.less',
    '3.3.4/less/badges.import.less',
    '3.3.4/less/breadcrumbs.import.less',
    '3.3.4/less/button-groups.import.less',
    '3.3.4/less/buttons.import.less',
    '3.3.4/less/close.import.less',
    '3.3.4/less/code.import.less',
    '3.3.4/less/component-animations.import.less',
    '3.3.4/less/dropdowns.import.less',
    '3.3.4/less/forms.import.less',
    '3.3.4/less/glyphicons.import.less',
    '3.3.4/less/grid.import.less',
    '3.3.4/less/input-groups.import.less',
    '3.3.4/less/jumbotron.import.less',
    '3.3.4/less/labels.import.less',
    '3.3.4/less/list-group.import.less',
    '3.3.4/less/media.import.less',

    '3.3.4/less/mixins.import.less',
    '3.3.4/less/modals.import.less',
    '3.3.4/less/navbar.import.less',
    '3.3.4/less/navs.import.less',
    '3.3.4/less/normalize.import.less',
    '3.3.4/less/pager.import.less',
    '3.3.4/less/pagination.import.less',
    '3.3.4/less/panels.import.less',
    '3.3.4/less/popovers.import.less',
    '3.3.4/less/print.import.less',
    '3.3.4/less/progress-bars.import.less',
    '3.3.4/less/responsive-embed.import.less',
    '3.3.4/less/responsive-utilities.import.less',
    '3.3.4/less/scaffolding.import.less',
    '3.3.4/less/tables.import.less',
    '3.3.4/less/theme.import.less',
    '3.3.4/less/thumbnails.import.less',
    '3.3.4/less/tooltip.import.less',
    '3.3.4/less/type.import.less',
    '3.3.4/less/variables.import.less',
    '3.3.4/less/wells.import.less',
  ], 'client');
*/
  api.addFiles([
    '3.3.4/fonts/glyphicons-halflings-regular.eot',
    '3.3.4/fonts/glyphicons-halflings-regular.svg',
    '3.3.4/fonts/glyphicons-halflings-regular.ttf',
    '3.3.4/fonts/glyphicons-halflings-regular.woff',
    '3.3.4/fonts/glyphicons-halflings-regular.woff2'
  ], 'client', { isAsset: true });

});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('leesangwon:bootstrap-less');
  api.addFiles('bootstrap-less-tests.js');
});
