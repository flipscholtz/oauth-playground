export default {
    authServerEndpoint: 'http://localhost:3001/auth',
    resourceServerEndpoint: 'http://localhost:3002',
    clientId: 'client-1-id',
    redirectUri: 'http://localhost:3000/callback',
    scope: 'view-cat-pic',
    // Change these to make the auth fail in various ways:
    tokenExchangeDelaySeconds: 0, // Longer than 10 seconds and the auth code will have expired on the server session
    sendInvalidCodeVerifier: false, // If true, the client will send a wrong code_verifier on code exchange (PKCE failure)
};