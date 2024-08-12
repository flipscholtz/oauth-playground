import express, { Request, Response, NextFunction } from 'express';
import authMiddleware from './middleware/authMiddleware';
import { ErrorWithStatus } from './types/error';
import * as fs from 'fs';

const router = express.Router();

router.get(
  '/catpic',
  [authMiddleware],
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const data = fs.readFileSync(__dirname + '/assets/catpic.jpg');
      res.send({image: Buffer.from(data.buffer).toString('base64')});
     //   res.sendFile(__dirname + '/assets/catpic.jpg');
    } catch (error) {
        const status = (error as ErrorWithStatus).status || 500;
        const message = (error as ErrorWithStatus).message || 'Failed to process request';
        res.status(status).send({error: message});
      console.log('ERR', error);
      next();
    }
  },
);

export default router;
