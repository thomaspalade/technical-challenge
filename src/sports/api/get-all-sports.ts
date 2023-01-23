import { Request, RequestHandler, Response } from 'express';

export const getAllSports: RequestHandler = async (
  req: Request,
  res: Response
) => {
  res.status(200).send({
    sortedSports: [],
  });
};
