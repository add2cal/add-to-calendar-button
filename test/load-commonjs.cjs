// simple check to see if we can require the commonJS script
// eslint-disable-next-line @typescript-eslint/no-var-requires
const requireTest = require('../npm_dist/cjs/index.js');
requireTest.AddToCalendarButton;
