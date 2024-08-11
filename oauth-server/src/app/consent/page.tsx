import { headers } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { getSessionDetails, setSessionStatus } from "../utils";

export default async function Consent() {
    try {
         const headerList = headers();
         const session = await getSessionDetails(headerList.get("x-current-url") as string);

         const handleApprove = () => {
            // Redirect to the session's requested redirectUri.
            // This would have already been validated against the customer's allowlist when the session was created.
            const redirectUrl = new URL(session.redirectUri);
            // TODO: Generate real jwt
            redirectUrl.searchParams.append('access_token', 'abc123');
            redirect(redirectUrl.toString(), RedirectType.replace);
         };

         const handleDeny = async () => {
            await setSessionStatus(session.id, 'consent-refused');
            return <h1>Operation cancelled!</h1>;
         };

         const scopes = session.scope.split(",");

         return <div>
              <p>{session.client.name} wants your permission to do the following:</p>
              <ul>
                {scopes.map((scope) => <li key={`scope-${scope}`}>{scope}</li>)}
              </ul>
              <form action={handleApprove}>
                <button className="bg-green-400" type="submit">Approve</button>
              </form>
              <form action={handleDeny}>
                <button className="bg-red-400" type="submit">Deny</button>
              </form>
         </div>
    } catch(err) {
        return <h1>Error: {(err as Error).message}</h1>
    }
  }
  