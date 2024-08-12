import { headers } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { getSessionDetails, Session } from "../utils";
import { v4 as uuid } from 'uuid';
import prisma from '../../lib/prisma';

const processSuccessfulGrant = async (session: Session): Promise<void> => {
    if(session.grantType === 'authorization_code') {
        const authCode = uuid();
        await prisma.session.update({
            where: {
                id: session.id
            },
            data: {
                status: 'grant_issued',
                authorizationCode: authCode,
                authCodeCreatedAt: new Date(),
            }
        });
        redirect(`${session.redirectUri}?code=${authCode}`, RedirectType.replace);
    } else {
        // TODO support more grant types
        throw new Error('Unsupported grant type');
    }
}

/**
 * Decides what should happen next based on the session status.
 * We redirect here after the user has answered the consent screen.
 */
export default async function ProcessSessionResult() {
    try {
         const headerList = headers();
         const session = await getSessionDetails(headerList.get("x-current-url") as string);

        
         if(session.status === 'consent-refused') {
            throw new Error('Consent refused');
         }

         if(session.status === 'consent-granted') {
            // We are ready to redirect back to the relying party with the result of the auth flow.
            await processSuccessfulGrant(session);
            return;
         }

         throw new Error(`Unexpected session status ${session.status} on ProcessSessionResult page`);
    } catch(err) {
        const msg = (err as Error).message;
        if(msg === 'NEXT_REDIRECT') {
            // redirect() works by throwing an error, which we must re-throw for the redirect to work.
            throw err;
        }
        return <h1>Error: {msg}</h1>
    }
  }
  