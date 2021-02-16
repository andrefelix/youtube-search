import { Request, Response } from 'express';
import { HttpResponse } from '../helpers/httpResponse';
import { missingParamError } from '../helpers/paramError';

interface SearchTermInterface {
  get(resquest: Request, response: Response): Response;
}

const SearchTerm = (): SearchTermInterface => {
  const get = (request: Request, response: Response) => {
    const httpResponse = HttpResponse(response);
    const { term } = request.query;

    try {
      if (!term) {
        return httpResponse.badRequest(missingParamError('term'));
      }

      return httpResponse.ok();
    } catch (err) {
      return httpResponse.serverError();
    }
  };

  return { get };
};

export { SearchTerm };
