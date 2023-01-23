import { Application } from 'express';
import { getAllSportsInAllLanguanges, getAllSports } from './api';

export default (app: Application) => {
  app.get(`^/v1/sports$`, getAllSports);
  app.get(`^/v1/sports/lang/:languageCode$`, getAllSportsInAllLanguanges);
};
