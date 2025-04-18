const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure the NODE_ENV is set to production
process.env.NODE_ENV = 'production';
console.log('Building Next.js app in production mode...');

try {
  // Clean up any existing build artifacts
  if (fs.existsSync(path.join(__dirname, '.next'))) {
    console.log('Cleaning up previous build...');
    execSync('rm -rf .next', { stdio: 'inherit' });
  }
  
  // Run Next.js build
  execSync('NODE_ENV=production next build', { stdio: 'inherit' });
  
  console.log('Next.js build completed successfully');
  
  // Copy the 404.html file to the output directory
  fs.copyFileSync(
    path.join(__dirname, 'public', '404.html'),
    path.join(__dirname, 'out', '404.html')
  );
  
  // Copy the .nojekyll file to the output directory
  fs.copyFileSync(
    path.join(__dirname, 'public', '.nojekyll'),
    path.join(__dirname, 'out', '.nojekyll')
  );
  
  console.log('Static files copied successfully');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
} 