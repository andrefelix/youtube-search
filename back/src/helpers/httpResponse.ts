import { Response } from 'express';
import { ErrorResponseInterface } from '../interfaces/errorResponseInterface';

interface HttpResponseInterface {
  badRequest(errorMessage: string): Response;
  serverError(): Response;
  ok(data: any): Response;
}

const HttpResponse = (response: Response): HttpResponseInterface => {
  const badRequest = (errorMessage: string) => {
    const body: ErrorResponseInterface = { statusCode: 400, errorMessage };
    return response.status(400).json(body);
  };

  const serverError = () => {
    const body: ErrorResponseInterface = {
      statusCode: 500,
      errorMessage: 'Internal Server Error'
    };

    return response.status(500).json(body);
  };

  const ok = (data: any) => {
    return response.status(200).json(data);
  };

  return { badRequest, serverError, ok };
};

export { HttpResponse };
