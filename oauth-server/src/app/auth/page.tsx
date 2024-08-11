'use client'

import { GoogleIDP } from '@/idp-servers/google/GoogleIDP';
import { redirect, RedirectType, useSearchParams } from 'next/navigation'
import { useEffect } from 'react';

export default function Auth() {
    const searchParams = useSearchParams();
    const provider = searchParams.get('provider');

    useEffect(() => {
        if(provider === 'google') {
            const idp = new GoogleIDP();
            redirect(idp.getAuthUrl(), RedirectType.replace);
        }
    }, [provider]);

    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="w-full">
            <h3>Auth Page</h3>
            <p>Log in with {provider}</p>
        </div>
      </main>
    );
  }
  