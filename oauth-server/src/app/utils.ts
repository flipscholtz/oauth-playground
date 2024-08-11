import prisma from '../lib/prisma';

export type Session = {
    id: string;
    clientId: number;
    client: Client;
    createdAt: Date;
    provider: string;
    scope: string;
    redirectUri: string;
    status: SessionStatus;
    authorizationCode: string | null;
};

export type Client = {
        id: number;
        name: string;
        clientId: string;
        clientSecret: string;
        jwtSecretKeyPem: string;
        allowedRedirectEndpoints: string;
        logo: string;
        createdAt: Date;
};

export type SessionStatus = 'awaiting-provider-auth' | 'provider-auth-failed' | 'awaiting-consent' | 'consent-granted' | 'consent-refused' | 'token_issued';

export const getSessionDetails = async (url: string): Promise<Session> => {
    const parsedUrl = new URL(url);
    const sessionId =  parsedUrl.searchParams.get('state');
    if(!sessionId) {
        throw new Error('Missing session ID');
    }
    const session = await prisma.session.findFirst({where: {id: sessionId}});
    if(!session) {
        throw new Error('Invalid session ID');
    }

    const client = await prisma.client.findFirst({where: { id: session.clientId }});
    if(!client) {
        throw new Error('Invalid client in session');
    }
    return {
        ...session,
        status: session.status as SessionStatus,
        client,
    };
}

export const setSessionStatus = async (sessionId: string, status: SessionStatus): Promise<void> => {
    await prisma.session.update({
        where: {
            id: sessionId,
        },
        data: {
            status
        }
    });
};