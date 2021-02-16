import { Request, Response } from 'express';
import { HttpResponse } from '../helpers/httpResponse';
import { missingParamError, invalidParamError } from '../helpers/paramError';
import { isJSON } from '../helpers/jsonValidate';

interface SearchTermInterface {
  get(resquest: Request, response: Response): Response;
}

const SearchTerm = (): SearchTermInterface => {
  const get = (request: Request, response: Response) => {
    const httpResponse = HttpResponse(response);
    const { term, minutesAvailableWeek } = request.query as {
      term: string;
      minutesAvailableWeek: string;
    };

    try {
      if (!term) {
        return httpResponse.badRequest(missingParamError('term'));
      }

      if (!minutesAvailableWeek) {
        return httpResponse.badRequest(
          missingParamError('minutesAvailableWeek')
        );
      }

      if (
        !isJSON(minutesAvailableWeek) ||
        !Array.isArray(JSON.parse(minutesAvailableWeek))
      ) {
        return httpResponse.badRequest(
          invalidParamError('minutesAvailableWeek')
        );
      }

      return httpResponse.ok();
    } catch (err) {
      if (process.env.NODE_ENV !== 'test') {
        console.error(err);
      }

      return httpResponse.serverError();
    }
  };

  return { get };
};

export { SearchTerm };
