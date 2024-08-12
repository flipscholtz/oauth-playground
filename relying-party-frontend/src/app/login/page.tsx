'use client'

import config from '../config';
import { createHash } from 'crypto';
import { v4 as uuid } from 'uuid';

export default function Login() {
    const generatePkceCode = (): {codeVerifier: string; codeChallenge: string} => {
      const codeVerifier = uuid();
      const codeChallenge =  createHash('sha256').update(codeVerifier).digest('hex');

      // We'll have to send the verifier when exchanging the auth code later, so remember it.
      localStorage.setItem("codeVerifier", codeVerifier);

      return {codeVerifier, codeChallenge};
    }

    const doLogin = (provider: string) => {
        const authServerEndpoint = process.env.NEXT_PUBLIC_AUTH_SERVER_ENDPOINT || config.authServerEndpoint;
        const authClientId = process.env.NEXT_PUBLIC_AUTH_CLIENT_ID || config.clientId;
        const redirectUri = process.env.NEXT_PUBLIC_AUTH_REDIRECT_URI || config.redirectUri;
        const scope = process.env.NEXT_PUBLIC_AUTH_SCOPE || config.scope;
        const authServerUrl = new URL(authServerEndpoint);
        authServerUrl.searchParams.append('provider', provider);
        authServerUrl.searchParams.append('grant_type', 'authorization_code');
        authServerUrl.searchParams.append('client_id', authClientId);
        authServerUrl.searchParams.append('redirect_uri', redirectUri);
        authServerUrl.searchParams.append('scope', scope);
        // Also saves the verifier to local storage so we can send it with code exchange later.
        const { codeChallenge } = generatePkceCode();
        authServerUrl.searchParams.append('code_challenge', codeChallenge);
        authServerUrl.searchParams.append('code_challenge_method', 'S256');

        window.open(authServerUrl.toString(), "_blank", "width=500,height=600");
    }
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="w-full">
          <p>Log in with:</p>
          <button onClick={() => doLogin('google')}>Google</button><br/>
          <button onClick={() => doLogin('password')} disabled={true}>Username / Password (not implemented yet)</button>
        </div>
      </main>
    );
  }
  