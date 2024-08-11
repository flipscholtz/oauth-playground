'use client'

import config from '../config';

export default function Login() {
    const doLogin = (provider: string) => {
        const url = new URL(config.authServerEndpoint);
        url.searchParams.append('provider', provider);
        url.searchParams.append('client_id', config.clientId);
        window.open(url.toString(), "_blank", "width=500,height=600");
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
  