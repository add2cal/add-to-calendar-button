/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line security/detect-child-process
const execSync = require('child_process').execSync;

// preparing the files
try {
  execSync('npm run build', { stdio: [0, 1, 2] });
} catch (error) {
  console.log('\n\nERROR: Something went wrong with the npm build script while testing!\n\n');
  throw error;
}

// test whether the base script (without the export statement) can also be loaded with Node without any critical error, even it would not work
try {
  execSync('node test/server-side-init.test.js', { stdio: [0, 1, 2] });
  console.log('\n\nSERVER INIT TEST SUCCESSFUL: server side initialization seems not to be blocked\nNEXT: testing the actual script...\n\n');
} catch (error) {
  console.log('\n\nSERVER INIT TEST FAILED: Something went wrong with the server side initialization test\n\n');
  throw error;
}
