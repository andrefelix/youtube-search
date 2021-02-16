import { Router, Application } from 'express';
import { SearchTerm } from '../controllers/searchTerm';

const router = Router();
const searchterm = SearchTerm();

const Routes = (app: Application): void => {
  router.get('/search/term', searchterm.get);

  app.use(router);
};

export { Routes };
