import { Request } from 'express';
import { SearchTerm } from '../controllers/searchTerm';
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
  it('deveria retornar statusCode 200', async () => {
    const mockResponse = makeResponse();
    const mockRequest = makeRequest();

    mockRequest.query = {
      term: 'term',
      minutesAvailableWeek: '[1,2,3,4,5,6,7]'
    };

    await searchTerm.execute(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenNthCalledWith(1, 200);
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

    mockRequest.query = { term: 'term', minutesAvailableWeek: 'invalid-value' };

    await searchTerm.execute(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenNthCalledWith(1, 400);
    expect(mockResponse.json).toBeCalledTimes(1);
    expect(mockResponse.json).toBeCalledWith(
      makeErrorResponse(invalidParamError('minutesAvailableWeek'), 400)
    );
  });
});
