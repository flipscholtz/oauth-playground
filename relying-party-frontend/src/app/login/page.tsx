'use client'

import config from '../config';

export default function Login() {
    const doLogin = (provider: string) => {
        const authServerEndpoint = process.env.NEXT_PUBLIC_AUTH_SERVER_ENDPOINT || config.authServerEndpoint;
        const authClientId = process.env.NEXT_PUBLIC_AUTH_CLIENT_ID || config.clientId;
        const redirectUri = process.env.NEXT_PUBLIC_AUTH_REDIRECT_URI || config.redirectUri;
        const authServerUrl = new URL(authServerEndpoint);
        authServerUrl.searchParams.append('provider', provider);
        authServerUrl.searchParams.append('client_id', authClientId);
        authServerUrl.searchParams.append('redirect_uri', redirectUri);
        window.open(authServerUrl.toString(), "_blank", "width=500,height=600");
    }
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="w-full">
          <p>Log in with:</p>
          <button onClick={() => doLogin('google')}>Google</button><br/>
          <button onClick={() => doLogin('password')}>Username / Password</button>
        </div>
      </main>
    );
  }
  