const missingParamError = (paramName: string): string => {
  return `Missing param ${paramName}`;
};

const invalidParamError = (paramName: string): string => {
  return `Invalid param ${paramName}`;
};

export { missingParamError, invalidParamError };
