import { isbot } from 'isbot';

const headlessChromium = /\bHeadlessChrome\//i;

export const shouldSkipPlaygroundClientLoad = (userAgent: string): boolean => {
  return isbot(userAgent) && !headlessChromium.test(userAgent);
};
