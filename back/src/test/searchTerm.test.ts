import { Request } from 'express';
import { SearchTerm } from '../controllers/searchTerm';

const makeResponse: any = () => {
  const res = { status: jest.fn(), send: jest.fn() };

  res.status = jest.fn().mockReturnValue(res);

  return res;
};

const mockRequest = {
  body: {}
} as Request;

const searchTerm = SearchTerm();

describe('SearchTerm', () => {
  it('deveria retornar statusCode 200', () => {
    const mockResponse = makeResponse();
    searchTerm.get(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenNthCalledWith(1, 200);
  });
});
