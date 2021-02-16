import express, { Application } from 'express';
import { Routes } from './routes';

const Configure = (app: Application): Application => {
  app.use(express.json());

  Routes(app);

  return app;
};

export { Configure };
