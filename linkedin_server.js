var urlUtil = Npm.require('url');

OAuth.registerService('linkedin', 2, null, function (query) {

    var response = getTokens(query);
    var accessToken = response.accessToken;
    var identity = getIdentity(accessToken);

    var profileUrl = identity.siteStandardProfileRequest.url;
    var urlParts = urlUtil.parse(profileUrl, true);

    var serviceData = {
        id: urlParts.query.id || Random.id(),
        accessToken: OAuth.sealSecret(accessToken),
        expiresAt: (+new Date) + (1000 * response.expiresIn)
    };

    var whiteListed = ['firstName', 'headline', 'lastName'];

    // include all fields from linkedin
    // https://developer.linkedin.com/documents/authentication
    var fields = _.pick(identity, whiteListed);

    fields.name = identity.firstName + ' ' + identity.lastName;

    return {
        serviceData: serviceData,
        options: { profile: fields }
    };
});

// checks whether a string parses as JSON
var isJSON = function (str) {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
};

// returns an object containing:
// - accessToken
// - expiresIn: lifetime of token in seconds
var getTokens = function (query) {
    var config = ServiceConfiguration.configurations.findOne({service: 'linkedin'});
    if (!config)
        throw new ServiceConfiguration.ConfigError('Service not configured');

    var responseContent;
    try {
        // Request an access token
        responseContent = HTTP.post(
            'https://api.linkedin.com/uas/oauth2/accessToken', {
                params: {
                    grant_type: 'authorization_code',
                    code: query.code,
                    client_id: config.clientId,
                    client_secret: OAuth.openSecret(config.secret),
                    redirect_uri: OAuth._redirectUri('linkedin', config)
                }
            }).content;
    } catch (err) {
        throw new Error('Failed to complete OAuth handshake with LinkedIn. ' + err.message);
    }

    // If 'responseContent' does not parse as JSON, it is an error.
    if (!isJSON(responseContent)) {
        throw new Error('Failed to complete OAuth handshake with LinkedIn. ' + responseContent);
    }

    // Success! Extract access token and expiration
    var parsedResponse = JSON.parse(responseContent);
    var accessToken = parsedResponse.access_token;
    var expiresIn = parsedResponse.expires_in;

    if (!accessToken) {
        throw new Error("Failed to complete OAuth handshake with LinkedIn " +
            "-- can't find access token in HTTP response. " + responseContent);
    }

    return {
        accessToken: accessToken,
        expiresIn: expiresIn
    };
};

var getIdentity = function (accessToken) {
    try {
        return HTTP.get('https://www.linkedin.com/v1/people/~', {
            params: { oauth2_access_token: accessToken, format: 'json'}
        }).data;
    } catch (err) {
        throw new Error('Failed to fetch identity from LinkedIn. ' + err.message,
            {response: err.response});
    }
};

LinkedIn.retrieveCredential = function (credentialToken, credentialSecret) {
    return OAuth.retrieveCredential(credentialToken, credentialSecret)
};
