Package.describe({
    name: 'jonperl:linkedin',
    summary: 'LinkedIn accounts OAuth flow',
    version: '1.0.0',
    git: 'https://github.com/jperl/meteor-linkedin'
});

Package.onUse(function (api) {
    api.versionsFrom('METEOR@0.9.2');

    api.use('oauth2', ['client', 'server']);
    api.use('oauth', ['client', 'server']);
    api.use('http', 'server');
    api.use(['underscore', 'service-configuration'], ['client', 'server']);
    api.use(['random', 'templating'], 'client');

    api.addFiles('linkedin_common.js', ['client', 'server']);
    api.addFiles(['linkedin_configure.html',
        'linkedin_configure.js'], 'client');
    api.addFiles('linkedin_server.js', 'server');
    api.addFiles('linkedin_client.js', 'client');

    api.export('LinkedIn');
});