import { Request, RequestHandler, Response } from 'express';

export const getEventData: RequestHandler = async (req: Request, res: Response) => {
  res.status(200).send({
    eventData: {}
  });
};
