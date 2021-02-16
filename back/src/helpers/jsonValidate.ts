const isJSON = (value: string): boolean => {
  try {
    JSON.parse(value);
  } catch (e) {
    return false;
  }

  return true;
};

export { isJSON };
