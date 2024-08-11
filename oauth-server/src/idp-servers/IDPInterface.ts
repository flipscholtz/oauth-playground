export interface IDPInterface {
    // Builds the external URL to which we redirect for authenticating the user on this IDP.
    getAuthUrl(details?: Record<string, unknown>): string;
    // When the IDP redirects back to us, do any validation of tokens etc to determine if IDP auth succeeded.
    isCallbackValid(path: string): Promise<boolean>;
};