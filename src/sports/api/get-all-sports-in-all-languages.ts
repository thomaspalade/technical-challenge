import { Request, RequestHandler, Response } from 'express';

export const getAllSportsInAllLanguanges: RequestHandler = async (
  req: Request,
  res: Response
) => {
  res.status(200).send({
    sortedSports: [],
  });
};
