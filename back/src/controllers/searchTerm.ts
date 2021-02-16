import { Request, Response } from 'express';

interface SearchTermInterface {
  get(resquest: Request, response: Response): Response;
}

const SearchTerm = (): SearchTermInterface => {
  const get = (request: Request, response: Response) => {
    return response.status(200).send();
  };

  return { get };
};

export { SearchTerm };
