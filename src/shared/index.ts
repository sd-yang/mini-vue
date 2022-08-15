export const extend = Object.assign;

export const isObject = (data) => {
  return typeof data === 'object' && data !== null;
};

export const hasChanged = (value, newValue) => {
  return !Object.is(value, newValue);
}