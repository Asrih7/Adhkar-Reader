const { execSync } = require('child_process');

module.exports = async () => {
  console.log('Starting Vite dev server...');
  execSync('npm run dev', { stdio: 'inherit' });
};