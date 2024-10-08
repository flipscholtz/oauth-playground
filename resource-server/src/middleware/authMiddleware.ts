import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, RequestHandler, Request, Response } from 'express';
import { ErrorWithStatus } from '../types/error';
import config from '../config'

export const decodeJwt = (jwt_token: string): JwtPayload => 
  jwt.verify(jwt_token, config.jwt.publicPEM) as JwtPayload;

const authMiddleware: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Preflight requests do not require authentication according to the CORS spec.
  if (req.method === 'OPTIONS') {
    return next();
  }

  const authError = (message: string = 'Unauthorized') => {
    const err = new ErrorWithStatus(message, 401);
    res.status(err.status || 500).send({error: err.message});
  };

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return authError();
  }

  const tokenParts = authHeader.split(' ');
  const tokenValue = tokenParts[1] || tokenParts[0];
  if (!tokenValue) {
    return authError();
  }

  try {
    const decodedJwt = decodeJwt(tokenValue);
    if (!decodedJwt) {
      return authError();
    }
    if(!decodedJwt.scopes.includes('view-cat-pic')) {
      return authError('Missing view-cat-pic scope');
    }
    res.locals.decodedJwt = decodedJwt;
    return next();
  } catch (err) {
    return authError();
  }
};
export default authMiddleware;
