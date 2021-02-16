import { Request } from 'express';
import { SearchTerm } from '../controllers/searchTerm';
import { ErrorResponseInterface } from '../interfaces/errorResponseInterface';
import { missingParamError } from '../helpers/paramError';

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
  it('deveria retornar statusCode 200', () => {
    const mockResponse = makeResponse();
    const mockRequest = makeRequest();

    mockRequest.query = { term: 'term' };

    searchTerm.get(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenNthCalledWith(1, 200);
  });

  it('deveria retornar statusCode 400 caso a query term não seja especificada', () => {
    const mockResponse = makeResponse();
    const mockRequest = makeRequest();

    searchTerm.get(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenNthCalledWith(1, 400);
  });

  it('deveria retornar menssagem dizendo que o parâmetro term não foi especificado', () => {
    const mockResponse = makeResponse();
    const mockRequest = makeRequest();

    searchTerm.get(mockRequest, mockResponse);
    expect(mockResponse.json).toBeCalledTimes(1);
    expect(mockResponse.json).toBeCalledWith(
      makeErrorResponse(missingParamError('term'), 400)
    );
  });
});
