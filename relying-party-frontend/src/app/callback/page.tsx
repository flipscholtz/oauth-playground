'use client'

import { useSearchParams } from 'next/navigation';
import config from '../config';
import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';

export default function Callback() {
    // Artificial delay to test auth code expiry
    const [exchangeDelayRemaining, setExchangeDelayRemaining] = useState<number>(config.tokenExchangeDelaySeconds);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [imageData, setImageData] = useState<string | null>(null);

    const searchParams = useSearchParams();
    const authCode = searchParams.get('code');
    if(!authCode) {
      setError('No auth code in callback uri');
    }

    const doTokenExchange = async (authCode: string): Promise<string | null> => {
      const authServerEndpoint = process.env.NEXT_PUBLIC_AUTH_SERVER_ENDPOINT || config.authServerEndpoint;
      const codeVerifier = localStorage.getItem("codeVerifier");
      try {
        const useCodeVerifier = config.sendInvalidCodeVerifier ? 'invalid-verifier' : codeVerifier;
        const response = await axios.get(`${authServerEndpoint}/token?subject_token=${authCode}&code_verifier=${useCodeVerifier}`);
        return response.data.access_token;
      } catch (err) {
        const json = (err as AxiosError).response?.data as {error: string;}
        console.log('JSON IS', json);
        setError(json.error || 'Unknown error');
        return null;
      }
    };
  

    useEffect(() => {
      if(exchangeDelayRemaining <= 0){
        // Do code exchange here.
        if(!!authCode){
          doTokenExchange(authCode).then(setAccessToken);
        }
        return;
      }

      setTimeout(() => setExchangeDelayRemaining((prev) => prev - 1), 1000);
    }, [exchangeDelayRemaining]);

    useEffect(() => {
      if(!accessToken) {
        return;
      }
      // We have an access token. Fetch the resource from the resource server.
      const endpoint = process.env.NEXT_PUBLIC_RESOURCE_SERVER_ENDPOINT || config.resourceServerEndpoint;
      const url = `${endpoint}/api/catpic`;
      axios.get(url, {headers: {Authorization: `Bearer ${accessToken}`}}).then((response) =>  {
        setImageData(response.data.image);
      }).catch((err) => {
        const error = err as AxiosError;
        setError((error.response?.data as {error: string;}).error as string);
      });
    }, [accessToken]);

    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="w-full">
            <p className="bg-blue-800 my-5">Auth code: {authCode}</p>
            {exchangeDelayRemaining > 0 && <p>{exchangeDelayRemaining} seconds until code exchange...</p>}
            {accessToken && <p className="bg-green-800">Access token: {accessToken}</p>}
            {error && <p className="bg-red-800">Error: {error}</p>}
            {imageData && <img className="my-5" src={`data:image/jpeg;base64,${imageData}`}></img>}
        </div>
      </main>
    );
  }
  