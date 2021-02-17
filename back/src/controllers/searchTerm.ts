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

/**
 * Calcula a quantidade de dias necessários para assistir todos os vídeos.
 *
 * @param {Array<number>} minutesAvailable
 * @param {Array<number>} durationMinutes
 *
 * @returns {number}
 */
const calculateDaysToWatch = (
  minutesAvailable: Array<number>,
  durationMinutes: Array<number>
): number => {
  const maxAvailableMinute = Math.max(...minutesAvailable);

  durationMinutes = durationMinutes.filter(
    (duration) => duration <= maxAvailableMinute
  );

  const durationLastPos = durationMinutes.length;
  let daysToWatch = 0;
  let weekPos = 0;

  for (let i = 0; i < durationLastPos; ) {
    let duration = durationMinutes[i];

    while (duration <= minutesAvailable[weekPos] && i < durationLastPos) {
      i++;
      duration += durationMinutes[i] || 0;
    }

    weekPos++;
    daysToWatch++;

    if (weekPos === minutesAvailable.length) {
      weekPos = 0;
    }
  }

  return daysToWatch;
};

const SearchTerm = (): SearchTermInterface => {
  const getIDsByTerm = async (term: string): Promise<Array<string>> => {
    const data = await youtubeDataAPIService.searchByTerm(term);
    return data.items.map((item) => item.id.videoId);
  };

  const getVideosByIDs = async (ids: Array<string>) => {
    const data = await youtubeDataAPIService.videosByIDs(ids);
    return data;
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
      const videos = await getVideosByIDs(ids);
      const daysToWatch = calculateDaysToWatch(
        minutesAvailableArr,
        videos.items.map((video) => (video.fileDetails.durationMs / 1000) * 60)
      );

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

export { SearchTerm, calculateDaysToWatch };
