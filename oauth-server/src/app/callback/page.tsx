import { GoogleIDP } from "@/idp-servers/google/GoogleIDP";
import { IDPInterface } from "@/idp-servers/IDPInterface";
import { headers } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import prisma from '@/lib/prisma'

export default async function Callback() {
    const headerList = headers();
    const url = new URL(headerList.get("x-current-url") as string);

    // Load the session from the DB from the 'state' parameter we got in the callback:
    const sessionId =  url.searchParams.get('state');
    if(!sessionId) {
        return <h1>Error: Missing session ID</h1>
    }
    const session = await prisma.session.findFirst({where: {id: sessionId}});
    if(!session) {
        return <h1>Error: Invalid session ID</h1>
    }
    const provider = session.provider;

    // Get an IDP implementation for the provider:
    let idp: IDPInterface;

    if(provider === 'google') {
        idp = new GoogleIDP(); 
    } else {
        return <h1>Error: Invalid IDP</h1>;
    }

    // Ask the IDP implementation to validate the fields in the callback (e.g. by doing a code exchange)
    const isValid = await idp.isCallbackValid(url.toString());
    if(!isValid) {
        return <h3>Error: Could not verify callback token with the IDP</h3>;
    }

    const client = await prisma.client.findFirst({where: { id: session.clientId }});
    if(!client) {
        return <h1>Error: Invalid client in session</h1>
    }

    // Redirect to the session's requested redirectUri.
    // This would have already been validated against the customer's allowlist when the session was created.
    const redirectUrl = new URL(session.redirectUri);
    // TODO: Generate real jwt
    redirectUrl.searchParams.append('access_token', 'abc123');

    // Everything looks good. Redirect back to the relying party frontend.
    redirect(redirectUrl.toString(), RedirectType.replace);
  }
  