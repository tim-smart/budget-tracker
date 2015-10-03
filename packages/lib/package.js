Package.describe({
  name: 'bt:lib',
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

  const both = ['client', 'server']

  const packages = [
    'meteor-base',        // Packages every Meteor app needs to have

    'mongo',              // The database Meteor supports right now

    'session',            // Client-side reactive dictionary for your app
    'tracker',            // Meteor's client-side reactive programming library

    'static-html',
    'standard-minifiers', // JS/CSS minifiers run for production mode
    'es5-shim',           // ECMAScript 5 compatibility for older browsers.
    'ecmascript',         // Enable ECMAScript2015+ syntax in app code

    'appcache',

    'ground:db',
  ]

  api.use(packages);
  api.imply(packages);

  api.addFiles([
    'namespace.js',
    'lib/crud-collection.js'
  ], both);

  api.export([
    'BT'
  ], both)
});

Package.onTest(function(api) {
});
