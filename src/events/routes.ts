import { Application } from 'express';
import { getEvents, getEventData } from './api';

export default (app: Application) => {
  app.get(`^/v1/events$`, getEvents);
  app.get(`^/v1/events/:eventId$`, getEventData);
};
