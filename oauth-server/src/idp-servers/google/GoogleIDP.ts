import axios from 'axios';
import { IDPInterface } from "../IDPInterface";
import googleConfig from "./config";
import appConfig from "../../app/config";

export class GoogleIDP implements IDPInterface {
    getAuthUrl(sessionId: string): string {
        const redirectEndpoint = process.env.OAUTH_SERVER_REDIRECT_ENDPOINT || appConfig.OAUTH_SERVER_REDIRECT_ENDPOINT;
        const googleClientId =  process.env.GOOGLE_CLIENT_ID || googleConfig.googleClientId;
        const url = new URL(googleConfig.googleOauthEndpoint);
        url.searchParams.append('client_id', googleClientId);
        url.searchParams.append('redirect_uri', redirectEndpoint);
        url.searchParams.append('response_type', 'code');
        url.searchParams.append('scope', 'https://www.googleapis.com/auth/userinfo.email');
        // So we can look up the session details when we receive the callback.
        url.searchParams.append('state', sessionId);
        return url.toString();
    }

    async isCallbackValid(fullUrl: string): Promise<boolean> {
        // After Google redirects back to us, exchange the authorization code for an access token.
        try {
            const incomingUrl = new URL(fullUrl);
            const authCode = incomingUrl.searchParams.get('code');
            if(!authCode) {
                console.error('No auth code from Google');
                return false;
            }
            const redirectEndpoint = process.env.OAUTH_SERVER_REDIRECT_ENDPOINT || appConfig.OAUTH_SERVER_REDIRECT_ENDPOINT;
            const googleClientId =  process.env.GOOGLE_CLIENT_ID || googleConfig.googleClientId;
            const tokenUrl = new URL('https://accounts.google.com/o/oauth2/token');
            tokenUrl.searchParams.append('grant_type', 'authorization_code');
            tokenUrl.searchParams.append('code', authCode);
            tokenUrl.searchParams.append('client_id', googleClientId);
            tokenUrl.searchParams.append('client_secret', process.env.GOOGLE_OAUTH_CLIENT_SECRET || "");
            tokenUrl.searchParams.append('redirect_uri', redirectEndpoint);
            const response = await axios.post(tokenUrl.toString());
            console.log('Google token response', response);
            // Pass as long as we have an access_token
            // We don't need any data from Google at the moment, so we're not using this access token for anything.
            // We just wanted to know that the user has a valid Google account.
            // We could fetch the user's profile info here and store it in our user db.
            return !!response.data.access_token;
        } catch(err) {
            console.error('Could not verify auth code with Google', err);
            return false;
        }  
    }
};