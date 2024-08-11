import axios from 'axios';
import { IDPInterface } from "../IDPInterface";
import googleConfig from "./config";
import appConfig from "../../app/config";

export class GoogleIDP implements IDPInterface {
    getAuthUrl(): string {
        const url = new URL(googleConfig.googleOauthEndpoint);
        url.searchParams.append('client_id', googleConfig.googleClientId);
        url.searchParams.append('redirect_uri', appConfig.OAUTH_SERVER_REDIRECT_ENDPOINT);
        url.searchParams.append('response_type', 'code');
        url.searchParams.append('scope', 'https://www.googleapis.com/auth/userinfo.email');
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
            const tokenUrl = new URL('https://accounts.google.com/o/oauth2/token');
            tokenUrl.searchParams.append('grant_type', 'authorization_code');
            tokenUrl.searchParams.append('code', authCode);
            tokenUrl.searchParams.append('client_id', googleConfig.googleClientId);
            tokenUrl.searchParams.append('client_secret', process.env.GOOGLE_OAUTH_CLIENT_SECRET || "");
            tokenUrl.searchParams.append('redirect_uri', appConfig.OAUTH_SERVER_REDIRECT_ENDPOINT);
            const response = await axios.post(tokenUrl.toString());
            console.log('Google token response', response);
            // Access token is valid if it returns a user_id on verification
            return !!response.data;
        } catch(err) {
            console.error('Could not verify auth code with Google', err);
            return false;
        }  
    }
};