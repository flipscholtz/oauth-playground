import { GoogleIDP } from "@/idp-servers/google/GoogleIDP";
import { IDPInterface } from "@/idp-servers/IDPInterface";
import { headers } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

export default async function Callback() {
    const headerList = headers();
    const url = headerList.get("x-current-url");
    
    if(!url) {
        return <h3>Error: Unknown callback URL</h3>
    }

    // TODO Get this from session data.
    const provider = url?.includes('google') ? 'google' : 'password';

    let idp: IDPInterface;

    if(provider === 'google') {
        idp = new GoogleIDP(); 
    } else {
        return <h1>Error: Invalid IDP</h1>;
    }
    const isValid = await idp.isCallbackValid(url);
    if(!isValid) {
        return <h3>Error: Could not verify callback token with the IDP</h3>;
    }

    // Everything looks good. Redirect back to the relying party frontend.
    // TODO: Lookup redirect URL from session data
    // TODO: Generate a real JWT
    redirect('http://localhost:3001?access_token=abc123', RedirectType.replace);
  }
  