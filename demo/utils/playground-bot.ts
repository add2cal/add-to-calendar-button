import { isbot } from 'isbot';

const headlessChromium = /\bHeadlessChrome\//i;

export const shouldSkipClientLoad = (userAgent: string): boolean => isbot(userAgent) && !headlessChromium.test(userAgent);
