import { Request, Response } from 'express';
import { HttpResponse } from '../helpers/httpResponse';
import { missingParamError, invalidParamError } from '../helpers/paramError';
import { isJSON } from '../helpers/jsonValidate';
import { YoutubeDataAPIService } from '../services/youtubeDataAPIService';
import { YoutubeDataAPIVideoListItem } from '../interfaces/youtubeDataAPIVideoListItem';

const youtubeDataAPIService = YoutubeDataAPIService();

interface SearchTermResponseDataInterface {
  mostUsedWords: Array<string>;
  daysToWatch: number;
  videos: Array<YoutubeDataAPIVideoListItem>;
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

/**
 * Resolve e retorna as 5 palavras mais usadas, contando com os títulos e
 * descrições dos vídeos.
 * @param {Array} items
 * @returns {Array<string>}
 */
const solveMostUsedWords = (
  items: Array<{ title: string; description: string }>
): Array<string> => {
  const mapped: Record<string, number> = {};
  let words: Array<string> = [];

  items.forEach((item) => {
    const textArr = `${item.title} ${item.description}`
      .toLocaleLowerCase()
      .replace(
        /([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, // substitui emogis por espaços
        ' '
      )
      .replace(/\s\s+/g, ' ') // substitui vários espaços por 1 apenas
      .split(' ');

    words = [...words, ...textArr];
  });

  words.forEach((word) => {
    mapped[word] = !mapped[word] ? 1 : mapped[word] + 1;
  });

  const mostUsedWords = Object.entries(mapped)
    .sort((arrA, arrB) => arrB[1] - arrA[1])
    .map((arrWord) => arrWord[0]);

  return mostUsedWords.slice(0, 5);
};

/**
 * Converte string ISO 8601 para seu valor correspondente em minutos.
 * @param {string} durantion
 * @returns {number}
 */
const ISO8601ToMinutes = (durantion: string): number => {
  const [hours] = durantion.match(/\d{1,2}[H]/) || ['0'];
  const [minutes] = durantion.match(/\d{1,2}[M]/) || ['0'];

  return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
};

const SearchTerm = (): SearchTermInterface => {
  const getIDsByTerm = async (term: string): Promise<Array<string>> => {
    const data = await youtubeDataAPIService.searchByTerm(term);
    return data.items.map((item) => item.id.videoId);
  };

  const getVideosByIDs = async (
    ids: Array<string>
  ): Promise<Array<YoutubeDataAPIVideoListItem>> => {
    const data = await youtubeDataAPIService.videosByIDs(ids);
    return data.items;
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

      const responseData: SearchTermResponseDataInterface = {
        daysToWatch: calculateDaysToWatch(
          minutesAvailableArr,
          videos.map((video) => ISO8601ToMinutes(video.contentDetails.duration))
        ),

        mostUsedWords: solveMostUsedWords(
          videos.map((videos) => {
            return {
              title: videos.snippet.title,
              description: videos.snippet.description
            };
          })
        ),

        videos
      };

      return httpResponse.ok(responseData);
    } catch (err) {
      if (process.env.NODE_ENV !== 'test') {
        console.error(err);
      }

      return httpResponse.serverError();
    }
  };

  return { execute };
};

export {
  SearchTerm,
  calculateDaysToWatch,
  solveMostUsedWords,
  ISO8601ToMinutes
};
