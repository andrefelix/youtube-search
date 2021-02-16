import { Application, Router } from 'express';

const router = Router();

const Routes = (app: Application): void => {
  router.get('/search/term', (request, response) => {
    return response.status(200).send();
  });

  app.use(router);
};

export { Routes };
