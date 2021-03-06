Package.describe({
  name: 'bt:transactions',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.2');

  api.use('bt:core');
  api.use('bt:lib');

  api.addFiles('collections.js');

  api.addFiles('server.js', ['server']);
  api.addFiles('client.js', ['client']);
});

Package.onTest(function(api) {
  api.use('bt:test');
  api.use('bt:transactions');
});
