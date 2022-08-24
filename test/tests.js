/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line security/detect-child-process
const execSync = require('child_process').execSync;

try {
  execSync('npm run build-npm', { stdio: [0, 1, 2] });

  try {
    execSync('node test/load-module.mjs', { stdio: [0, 1, 2] });
    console.log('TEST SUCCESSFUL: importing the script as module\n');
  } catch (error) {
    console.log('FAILED: Something went wrong with testing the ES Module setup\n');
    throw error;
  }

  try {
    execSync('node test/load-commonjs.cjs', { stdio: [0, 1, 2] });
    console.log('TEST SUCCESSFUL: commonJS init via require\n');
  } catch (error) {
    console.log('FAILED: Something went wrong with testing the commonJS setup\n');
    throw error;
  }

  try {
    execSync('node test/server-side-rendering.js', { stdio: [0, 1, 2] });
    console.log('TEST SUCCESSFUL: server side rendering seems not to be blocked\n');
  } catch (error) {
    console.log('FAILED: Something went wrong with the server side rendering test\n');
    throw error;
  }

  const fs = require('fs');
  const dirToDrop = 'npm_dist';
  fs.rm(dirToDrop, { recursive: true }, (error) => {
    if (error) {
      throw error;
    }
    console.log(`${dirToDrop} deleted again\n`);
  });
} catch (error) {
  console.log('FAILED: Something went wrong with the npm build script while testing');
}
