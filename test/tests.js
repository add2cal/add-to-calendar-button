/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line security/detect-child-process
const execSync = require('child_process').execSync;

// preparing the files
try {
  execSync('npm run build', { stdio: [0, 1, 2] });
} catch (error) {
  console.log('\n\nFAILED: Something went wrong with the npm build script while testing!\n\n');
  throw error;
}

// executing the actual tests

// cleaning up
try {
  const fs = require('fs');
  const dirToDrop = 'dist';
  fs.rm(dirToDrop, { recursive: true }, (error) => {
    if (error) {
      throw error;
    }
    console.log(`${dirToDrop} deleted again`);
  });
} catch (error) {
  console.log('\n\nWARNING: Something went wrong deleting the dist folder after testing!\n\n');
  throw error;
}