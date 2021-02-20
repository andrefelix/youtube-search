import express, { Application, NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import { config } from 'dotenv';

config();

import { Routes } from './routes';

const Configure = (app: Application): Application => {
  app.use((request: Request, response: Response, next: NextFunction) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET');
    next();
  });

  app.use(morgan('dev'));
  app.use(express.json());

  Routes(app);

  return app;
};

export { Configure };
