// Request LinkedIn credentials for the user
// @param options {optional}
// @param credentialRequestCompleteCallback {Function} Callback function to call on
//   completion. Takes one argument, credentialToken on success, or Error on
//   error.
LinkedIn.requestCredential = function (options, credentialRequestCompleteCallback) {
    // support a callback without options
    if (!credentialRequestCompleteCallback && typeof options === 'function') {
        credentialRequestCompleteCallback = options;
        options = {};
    }

    var config = ServiceConfiguration.configurations.findOne({
        service: 'linkedin'
    });
    if (!config) {
        credentialRequestCompleteCallback && credentialRequestCompleteCallback(new ServiceConfiguration.ConfigError());
        return;
    }

    var credentialToken = Random.secret();

    var loginStyle = OAuth._loginStyle('linkedin', config, options);

    var scope = [];
    if (options && options.requestPermissions) {
        scope = options.requestPermissions.join('+');
    }

    var loginUrl =
        'https://www.linkedin.com/uas/oauth2/authorization?' +
            'state=' + OAuth._stateParam(loginStyle, credentialToken) +
            '&response_type=code&' +
            'client_id=' + config.clientId +
            '&scope=' + scope;

    loginUrl += '&redirect_uri=' + OAuth._redirectUri('linkedin', config);

    OAuth.launchLogin({
        loginService: 'linkedin',
        loginStyle: loginStyle,
        loginUrl: loginUrl,
        credentialRequestCompleteCallback: credentialRequestCompleteCallback,
        credentialToken: credentialToken,
        popupOptions: {width: 470, height: 420}
    });
};
