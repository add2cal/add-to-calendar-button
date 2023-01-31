/* eslint-disable no-undef */

// simple import of the atcb JS (base and commonJS version), to ensure it can load in Node
// it shall not run on the server, but also should not block it!
require('../dist/atcb.js');
require('../dist/commonjs/index.js');
