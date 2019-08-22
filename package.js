Package.describe({
  name: 'jonperl:linkedin',
  summary: 'LinkedIn accounts OAuth flow',
  version: '1.1.1',
  git: 'https://github.com/jperl/meteor-linkedin'
});

Package.onUse(function (api) {
  api.versionsFrom('METEOR@0.9.2');

  var both = ['server', 'web'];

  api.use(['oauth2', 'oauth', 'service-configuration', 'underscore'], both);
  api.use('http', 'server');
  api.use(['random', 'templating'], 'web');

  api.addFiles('linkedin_common.js', both);
  api.addFiles('linkedin_server.js', 'server');
  api.addFiles([
    'linkedin_client.js',
    'linkedin_configure.html', 'linkedin_configure.js'
  ], 'web');

  api.export(['LinkedIn', 'Linkedin'], both);
});
