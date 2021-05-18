import { Request } from 'express';
import {
  SearchTerm,
  calculateDaysToWatch,
  solveMostUsedWords,
  ISO8601ToMinutes
} from '../controllers/searchTerm';
import { ErrorResponseInterface } from '../interfaces/errorResponseInterface';
import { missingParamError, invalidParamError } from '../helpers/paramError';

const makeResponse: any = () => {
  const res = { status: jest.fn(), send: jest.fn(), json: jest.fn() };

  res.status = jest.fn().mockReturnValue(res);

  return res;
};

const makeRequest = () => {
  const request = {
    query: {}
  } as Request;

  return request;
};

const makeErrorResponse = (
  errorMessage: string,
  statusCode: number
): ErrorResponseInterface => {
  return { errorMessage, statusCode };
};

const searchTerm = SearchTerm();

describe('SearchTerm', () => {
  describe('HTTP Response', () => {
    it('deveria retornar statusCode 200', async () => {
      const mockResponse = makeResponse();
      const mockRequest = makeRequest();

      mockRequest.query = {
        term: 'term',
        minutesAvailableWeek: '[1,2,3,4,5,6,7]'
      };

      await searchTerm.execute(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenNthCalledWith(1, 200);
      expect(mockResponse.json).toBeCalledTimes(1);
    });

    it('deveria retornar statusCode 400 com a mensagem de que a query term não foi especificada', async () => {
      const mockResponse = makeResponse();
      const mockRequest = makeRequest();

      await searchTerm.execute(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenNthCalledWith(1, 400);
      expect(mockResponse.json).toBeCalledTimes(1);
      expect(mockResponse.json).toBeCalledWith(
        makeErrorResponse(missingParamError('term'), 400)
      );
    });

    it('deveria retornar statusCode 400 com a mensagem de que a query minutesAvailableWeek não foi especificada', async () => {
      const mockResponse = makeResponse();
      const mockRequest = makeRequest();

      mockRequest.query = { term: 'term' };

      await searchTerm.execute(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenNthCalledWith(1, 400);
      expect(mockResponse.json).toBeCalledTimes(1);
      expect(mockResponse.json).toBeCalledWith(
        makeErrorResponse(missingParamError('minutesAvailableWeek'), 400)
      );
    });

    it('deveria retornar statusCode 400 com a mensagem de que a query minutesAvailableWeek é inválida', async () => {
      const mockResponse = makeResponse();
      const mockRequest = makeRequest();

      mockRequest.query = {
        term: 'term',
        minutesAvailableWeek: 'invalid-value'
      };

      await searchTerm.execute(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenNthCalledWith(1, 400);
      expect(mockResponse.json).toBeCalledTimes(1);
      expect(mockResponse.json).toBeCalledWith(
        makeErrorResponse(invalidParamError('minutesAvailableWeek'), 400)
      );
    });
  });

  describe('Métodos auxiliares', () => {
    it('deveria retornar a quantidade de dias exatos para terminar os vídeos', () => {
      const minutesWeek = [15, 120, 30, 150, 20, 40, 90];
      const durations = [20, 30, 60, 90, 200, 30, 40, 20, 60, 15];
      const days = calculateDaysToWatch(minutesWeek, durations);

      expect(days).toEqual(8);
    });

    it('deveria retornar 0 dias quando não houver vídeos com duração inferior ao minuto máximo disponível na semana', () => {
      const minutesWeek = [15, 120, 30, 150, 20, 40, 90];
      const durations = [151, 151, 151, 151, 151, 151];
      const days = calculateDaysToWatch(minutesWeek, durations);

      expect(days).toEqual(0);
    });

    it('deveria retornar 1 caso houver um único vídeo e o tempo do mesmo for igual ao tempo disponível no primeiro dia da semana', () => {
      const minutesWeek = [15, 120, 30, 150, 20, 40, 90];
      const durations = [15];
      const days = calculateDaysToWatch(minutesWeek, durations);

      expect(days).toEqual(1);
    });

    it('deveria retornar 1 dia caso existir 15 durações de 1 minuto e o tempo do primeiro dia da semana for 15', () => {
      const minutesWeek = [15, 120, 30, 150, 20, 40, 90];
      const durations = new Array(15).fill(1);
      const days = calculateDaysToWatch(minutesWeek, durations);

      expect(days).toEqual(1);
    });

    it('deveria retornar as 5 palavras com maior número de repetições nos textos fornecidos', () => {
      const items = [
        {
          title: 'uma duas duas',
          description: 'três três três'
        },
        {
          title: 'quatro quatro quatro quatro',
          description: 'cinco cinco cinco cinco cinco'
        }
      ];

      const expected = ['cinco', 'quatro', 'três', 'duas', 'uma'];
      const mostUsedWords = solveMostUsedWords(items);

      expect(mostUsedWords).toEqual(expected);
    });

    it('deveria retornar palavra vazia, caso o título e descrição forem fornecidos com vários espaços', () => {
      const items = [
        { title: '  ', description: '  ' },
        { title: '  ', description: '  ' }
      ];

      const expected = [''];
      const mostUsedWords = solveMostUsedWords(items);

      expect(mostUsedWords).toEqual(expected);
    });

    it('deveria retornar palavra vazia, caso o título e descrição forem fornecidos com string vazia', () => {
      const items = [
        { title: '', description: '' },
        { title: '', description: '' }
      ];

      const expected = [''];
      const mostUsedWords = solveMostUsedWords(items);

      expect(mostUsedWords).toEqual(expected);
    });

    it('deveria retornar o valor em minutos corretos de uma string no formato ISO 8601', () => {
      expect(ISO8601ToMinutes('')).toEqual(0);
      expect(ISO8601ToMinutes('PT0H0M0S')).toEqual(0);
      expect(ISO8601ToMinutes('PT10M19S')).toEqual(10);
      expect(ISO8601ToMinutes('PT3H20M14S')).toEqual(200);
      expect(ISO8601ToMinutes('PT12H0M0S')).toEqual(720);
    });
  });
});
