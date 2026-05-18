const { execSync } = require('child_process');

module.exports = async () => {
  console.log('🚀 Starting Vite dev server...');
  try {
    execSync('npm run dev', { stdio: 'inherit' });
  } catch (error) {
    console.error('Failed to start dev server:', error.message);
    throw error;
  }
};
