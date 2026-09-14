const headlessChromium = /\bHeadlessChrome\//i;

export const shouldSkipPlaygroundClientLoad = (isBot: boolean, userAgent: string): boolean => {
  return isBot && !headlessChromium.test(userAgent);
};
