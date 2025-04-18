const fs = require('fs');
const path = require('path');

// Ensure directories exist
function ensureDirectoryExistence(dirPath) {
  if (fs.existsSync(dirPath)) return true;
  
  ensureDirectoryExistence(path.dirname(dirPath));
  fs.mkdirSync(dirPath);
  return true;
}

// Copy directory recursively
function copyDir(src, dest) {
  // Create destination directory if it doesn't exist
  ensureDirectoryExistence(dest);
  
  // Get all files in source directory
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    // If it's a directory, copy recursively
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      // Otherwise, copy the file
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied: ${srcPath} -> ${destPath}`);
    }
  }
}

// Main function
function main() {
  const publicDir = path.join(__dirname, '../public');
  const outDir = path.join(__dirname, '../out');
  
  // Ensure out directory exists
  if (!fs.existsSync(outDir)) {
    console.log('Output directory does not exist yet. Will be created by the build process.');
    return;
  }
  
  // Copy public directory to out
  console.log('Copying images from public to out directory...');
  copyDir(publicDir, outDir);
  
  console.log('Done! Images have been copied to the out directory.');
}

// Run the script
main(); 