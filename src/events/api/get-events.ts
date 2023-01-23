import { Request, RequestHandler, Response } from 'express';

export const getEvents: RequestHandler = async (req: Request, res: Response) => {
  res.status(200).send({
    allEvents: []
  });
};
