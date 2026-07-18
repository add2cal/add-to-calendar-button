// eslint-disable-next-line security/detect-child-process
const execSync = require('child_process').execSync;

const arg = process.argv[2] || 'patch';

execSync('node scripts/set-version.mjs ' + arg, { stdio: [0, 1, 2] });
execSync('npm install', { stdio: [0, 1, 2] });
execSync('npm run build', { stdio: [0, 1, 2] });
execSync('cd demo', { stdio: [0, 1, 2] });
execSync('npm install', { stdio: [0, 1, 2] });
