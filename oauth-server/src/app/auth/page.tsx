import { GoogleIDP } from '@/idp-servers/google/GoogleIDP';
import { headers } from 'next/headers';
import { redirect, RedirectType } from 'next/navigation'

export default function Auth() {
  const headerList = headers();
  const url = new URL(headerList.get("x-current-url") || "");
  const provider = url.searchParams.get('provider');

    if(provider === 'google') {
      const idp = new GoogleIDP();
      redirect(idp.getAuthUrl(), RedirectType.replace);
    } else {
      return <h1>Error: Invalid provider</h1>
    }
  }
  