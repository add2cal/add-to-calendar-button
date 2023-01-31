// eslint-disable-next-line security/detect-child-process
const execSync = require('child_process').execSync;

const arg = process.argv[2] || 'patch';

execSync('npx grunt version::' + arg, { stdio: [0, 1, 2] });
execSync('npm install', { stdio: [0, 1, 2] });
execSync('npm run build:all', { stdio: [0, 1, 2] });
