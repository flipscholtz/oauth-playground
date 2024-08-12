import { GoogleIDP } from "@/idp-servers/google/GoogleIDP";
import { IDPInterface } from "@/idp-servers/IDPInterface";
import { headers } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { getSessionDetails, setSessionStatus } from '../utils';

export default async function Callback() {
    const headerList = headers();
    const url = new URL(headerList.get("x-current-url") as string);

    let redirectPath = null;
    try {
        const session = await getSessionDetails(headerList.get("x-current-url") as string);
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
            throw new Error('Could not verify callback token with the IDP');
        }

        // IDP auth has passed. Proceed to consent step.
        await setSessionStatus(session.id, 'awaiting-consent');
        redirectPath = `/consent?state=${session.id}`;
    } catch(err) {
        console.error(err);
        return <h1>Error: {(err as Error).message}</h1>
    }
    
    // Can't put the redirect inside the try / catch because it does not behave correctly.
    // https://stackoverflow.com/questions/76191324/next-13-4-error-next-redirect-in-api-routes
    if(redirectPath) {
        redirect(redirectPath, RedirectType.replace);
    }
  }
  