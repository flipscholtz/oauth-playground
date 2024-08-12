import { headers } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { getSessionDetails, setSessionStatus } from "../utils";

export default async function Consent() {
    try {
         const headerList = headers();
         const session = await getSessionDetails(headerList.get("x-current-url") as string);

         const handleApprove = async () => {
            'use server'
            await setSessionStatus(session.id, 'consent-granted');
            redirect(`/processSessionResult?state=${session.id}`, RedirectType.replace);
         };

         const handleDeny = async () => {
            'use server'
            await setSessionStatus(session.id, 'consent-refused');
            redirect(`/processSessionResult?state=${session.id}`, RedirectType.replace);
         };

         const scopes = session.scope.split(",");

         return <div>
              <p>{session.client.name} wants your permission to do the following:</p>
              <ul>
                {scopes.map((scope) => <li className="list-disc ml-6" key={`scope-${scope}`}>{scope}</li>)}
              </ul>
              <div className="flex flex-col items-center">
              <form action={handleApprove}>
                <button className="bg-green-700 my-5" type="submit">Approve</button>
              </form>
              <form action={handleDeny}>
                <button className="bg-red-400" type="submit">Deny</button>
              </form>
              </div>
         </div>
    } catch(err) {
        return <h1>Error: {(err as Error).message}</h1>
    }
  }
  