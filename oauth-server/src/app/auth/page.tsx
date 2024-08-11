import { GoogleIDP } from '@/idp-servers/google/GoogleIDP';
import { IDPInterface } from '@/idp-servers/IDPInterface';
import { headers } from 'next/headers';
import { redirect, RedirectType } from 'next/navigation'
import prisma from '@/lib/prisma'
import { v4 as uuid } from 'uuid';

export default async function Auth() {
  const headerList = headers();
  const url = new URL(headerList.get("x-current-url") || "");
  const provider = url.searchParams.get('provider');
  const clientId = url.searchParams.get('client_id');

  // Validate the client ID:
  if(!clientId) {
    return <h1>Error: Missing client_id</h1>
  }

  const client = await prisma.client.findFirst({
    where: {
      clientId
    }
  });
  if(!client) {
    return <h1>Error: Invalid client_id</h1>
  }

  // Validate the provider:
  let idp: IDPInterface;

    if(provider === 'google') {
      idp = new GoogleIDP();
    } else {
      return <h1>Error: Invalid provider</h1>
    }

    // If a redirectUri was passed in, validate it against the customer's allowlist and save it on the session.
    let redirectUri = url.searchParams.get('redirect_uri');
    const redirectAllowlist = client.allowedRedirectEndpoints.split(",");
    if(!Array.isArray(redirectAllowlist) || redirectAllowlist.length < 1) {
      return <h1>No allowed redirectUri configured for client</h1>
    }
    if(!redirectUri) {
      // The relying party did not request a specific redirect URI.
      // Use the first one configured for the client.
      redirectUri = redirectAllowlist[0];
    }

    // Create a new session in the DB:
    const sessionId = uuid();
    await prisma.session.create({
      data: {
        id: sessionId,
        provider,
        clientId: client.id,
        redirectUri,
      }
    });


    // Redirect to the IDP auth site, passing the session ID as the state parameter
    redirect(idp.getAuthUrl(sessionId), RedirectType.replace);
  }
  