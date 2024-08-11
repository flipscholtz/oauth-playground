'use client'

import { useSearchParams } from 'next/navigation';

export default function Callback() {
    const searchParams = useSearchParams();
    const accessToken = searchParams.get('access_token');
    if(!accessToken) {
        return (<h1>Error: No access_token in callback uri</h1>);
    }

    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="w-full">
            <p>Access token: {accessToken}</p>
        </div>
      </main>
    );
  }
  