Package.describe({
  name: 'bt:test',
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
});

Package.onTest(function(api) {
  const packages = [
    'bt:core',
    'sanjo:jasmine@0.20.1'
  ]

  api.use(packages);
  api.imply(packages)
});
