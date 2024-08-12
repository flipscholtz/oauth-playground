import type { NextApiResponse } from 'next'
import { getSessionByAuthCode, Session } from '../../utils';
import { createHash } from 'crypto';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
 
type ResponseData = {
  access_token?: string;
  error?: string;
};

const MAX_AUTH_CODE_AGE_SECONDS = 10;

const validateAuthCode = (session: Session) => {
    if(!session.authorizationCode || session.status !== 'grant_issued' || !session.authCodeCreatedAt) {
        throw new Error('Auth code missing or session not in correct status');
    }
    // Don't allow exchanging the token after the session reaches a certain age (default 30 seconds)
    const now = new Date();
    const ageSeconds = Math.floor((now.getTime() - session.authCodeCreatedAt.getTime()) / 1000);
    if(ageSeconds > MAX_AUTH_CODE_AGE_SECONDS) {
        throw new Error('Session expired');
    }
};

const validatePkce = (session: Session, currentUrl: string) => {
    const codeVerifier = (new URL(currentUrl)).searchParams.get('code_verifier');
    if(!codeVerifier) {
        throw new Error('Missing code verifier');
    }

    const expectedCodeChallenge = createHash('sha256').update(codeVerifier).digest('hex');
    if(session.codeChallenge !== expectedCodeChallenge) {
        throw new Error('Invalid code verifier');
    }

    // PKCE verification passed.
}
 
export async function GET(
  _req: NextRequest,
  res: NextApiResponse<ResponseData>
) {
    try {
        const headerList = headers();
        const currentUrl = headerList.get("x-current-url") as string;
        const authorizationCode = (new URL(currentUrl)).searchParams.get('subject_token');
        const session = await getSessionByAuthCode(authorizationCode);

        validateAuthCode(session);
        validatePkce(session, currentUrl);

        console.log('Secret key', session.client.jwtSecretKeyPem);
     
        // All checks passed. We can issue a JWT with the requested scopes,
        // signed by the client's associated RSA private key from the db.
        const accessToken = jwt.sign({
           scopes: session.scope.split(","),
        }, session.client.jwtSecretKeyPem, {algorithm: 'RS256',expiresIn: '30m'});

        return NextResponse.json({ access_token: accessToken }, { status: 200 });
   } catch(err) {
    console.error('ERR', err);
    return NextResponse.json({  error: (err as Error).message, }, { status: 400 });
   }
}