import { Request, Response } from 'express';
import { HttpResponse } from '../helpers/httpResponse';
import { missingParamError, invalidParamError } from '../helpers/paramError';
import { isJSON } from '../helpers/jsonValidate';
import { YoutubeDataAPIService } from '../services/youtubeDataAPIService';

const youtubeDataAPIService = YoutubeDataAPIService();

interface SearchTermResponseInterface {
  mostUsedWords: Array<string>;
  daysToWatch: number;
}

interface SearchTermInterface {
  execute(resquest: Request, response: Response): Promise<Response>;
}

const SearchTerm = (): SearchTermInterface => {
  const getIDsByTerm = async (term: string): Promise<Array<string>> => {
    const data = await youtubeDataAPIService.searchByTerm(term);
    return data.items.map((item) => item.id.videoId);
  };

  const execute = async (request: Request, response: Response) => {
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

      const minutesAvailableArr: Array<number> = isJSON(minutesAvailableWeek)
        ? JSON.parse(minutesAvailableWeek)
        : [];

      if (
        minutesAvailableArr.length !== 7 ||
        minutesAvailableArr.some((val) => !Number.isInteger(val))
      ) {
        return httpResponse.badRequest(
          invalidParamError('minutesAvailableWeek')
        );
      }

      const ids = await getIDsByTerm(term);

      return httpResponse.ok();
    } catch (err) {
      if (process.env.NODE_ENV !== 'test') {
        console.error(err);
      }

      return httpResponse.serverError();
    }
  };

  return { execute };
};

export { SearchTerm };
