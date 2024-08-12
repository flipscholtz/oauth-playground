# Experimental OAuth stack
This is a learning exercise. I coded up some core OAuth flows without hiding any interactions behind libraries or platforms, so that I could become more familiar with the spec.

Features:
- supports the `authorization_code` grant type 
- PKCE support (token endpoint requires a `code_verifier` whose hash matches the session's stored `code_challenge`)
- Session expiry (token exchange must happen soon after the auth code was issued)
- Consent prompt with dynamic list of scopes
- Issues JWT signed by client-specific RSA key.
- not fully spec-compliant...for e.g, some required fields in the token exchange endpoint are not set
- OAuth server uses NextJS Server Components (convenient to combine the UI with the server logic)

## Components
### resource-server
Hosts a picture of a cat behind `GET /api/catpic`.
Auth middleware checks for a JWT signed by `config.publicPEM` and with a `scopes` array on the payload containing `view-cat-pic`.

### oauth-server
Combines:
- A Postgres DB (Vercel postgres with prisma) for Client and Session data.
- An /auth endpoint to start the OAuth2 flow. Includes UI for prompting the user for consent. Results in a redirect back to `redirect_uri` with the authorization code
- A /token endpoint to exchange the auth code for a JWT.
- An IDP interface handling the behind-the-scenes integration with identity providers
    - Google (currently implemented)
        Client ID in `google/config.googleClientId` . Client secret in `process.env.GOOGLE_OAUTH_CLIENT_SECRET`. Current clientId is from my personal account.
    - TODO: Basic auth (simple db of username / password)


### relying-party-frontend
- Clicking "Log in with Google" initiates the oauth flow. 
- When the OAuth server redirects back to `/callback` with the auth code, the token exchange is done followed by the resource request.
- Session expiry can be simulated by setting `config.tokenExchangeDelaySeconds` > 10 seconds (see `MAX_AUTH_CODE_AGE_SECONDS` in oauth-server)
- Invalid PKCE code_verifier can be simulates by setting `config.sendInvalidCodeVerifier: true`

## Testing on Vercel (already deployed)
Visit https://relying-party-frontend.vercel.app/login and proceed to log in with Google.
None of your account data will be stored. Only the `userinfo.email` scope is requested, and Google is not involved beyond verifying that you have an account there.

After going through the flow, you should eventually see a cat picture show up at the bottom of the pop-up window, after the Access Token is printed.

## Running locally

You'll need a Postgres database. Set the various POSTGRES_* env vars:
```
POSTGRES_DATABASE
POSTGRES_HOST
POSTGRES_PASSWORD
POSTGRES_PRISMA_URL
POSTGRES_URL
POSTGRES_URL_NON_POOLING
POSTGRES_URL_NO_SSL
POSTGRES_USER
```
Then, running `yarn build` in oauth-server should auto-create the schema.
You'll also have to create a PEM-encoded RSA keypair and put the private key in the jwtSecretKeyPem column in the Client table for the client you're testing.


The ports below match the defaults in config:

```
# Resource server
cd resource-server && PORT=3002 yarn express:server

# OAuth server
cd oauth-server && PORT=3001 yarn dev

# Relying party frontend
cd relying-party-frontend && PORT=3000 yarn dev
```

Open the relying party frontend in the browser and click the Log in with Google button.
