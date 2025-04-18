/**
 * This script ensures CSS files are properly processed after build
 */
const fs = require('fs');
const path = require('path');

console.log('Running post-build CSS processing...');

// Find all CSS files
const cssDir = path.join(process.cwd(), 'out', '_next', 'static', 'css');

if (!fs.existsSync(cssDir)) {
  console.error('CSS directory not found:', cssDir);
  console.log('Creating CSS directory...');
  try {
    fs.mkdirSync(cssDir, { recursive: true });
  } catch (err) {
    console.error('Failed to create CSS directory:', err);
    process.exit(1);
  }
}

// Find all HTML files
const htmlFiles = [];
const findHtmlFiles = (dir) => {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(dirent => {
    const fullPath = path.join(dir, dirent.name);
    if (dirent.isDirectory()) {
      findHtmlFiles(fullPath);
    } else if (dirent.name.endsWith('.html')) {
      htmlFiles.push(fullPath);
    }
  });
};

const outDir = path.join(process.cwd(), 'out');
if (fs.existsSync(outDir)) {
  findHtmlFiles(outDir);
  console.log(`Found ${htmlFiles.length} HTML files`);
  
  // Find CSS files
  const cssFiles = fs.existsSync(cssDir) ? 
    fs.readdirSync(cssDir).filter(file => file.endsWith('.css')) : [];
  
  if (cssFiles.length === 0) {
    console.warn('No CSS files found in the build output!');
    
    // If no CSS files found, check if they exist in .next directory
    const nextCssDir = path.join(process.cwd(), '.next', 'static', 'css');
    if (fs.existsSync(nextCssDir)) {
      const nextCssFiles = fs.readdirSync(nextCssDir).filter(file => file.endsWith('.css'));
      if (nextCssFiles.length > 0) {
        console.log(`Found ${nextCssFiles.length} CSS files in .next directory. Copying to out directory...`);
        
        // Create the output directory if it doesn't exist
        if (!fs.existsSync(cssDir)) {
          fs.mkdirSync(cssDir, { recursive: true });
        }
        
        // Copy CSS files
        nextCssFiles.forEach(file => {
          const source = path.join(nextCssDir, file);
          const destination = path.join(cssDir, file);
          fs.copyFileSync(source, destination);
          console.log(`Copied ${file} to ${destination}`);
        });
      }
    }
  }
  
  // Check if we now have CSS files
  const updatedCssFiles = fs.existsSync(cssDir) ? 
    fs.readdirSync(cssDir).filter(file => file.endsWith('.css')) : [];
  
  // Update HTML files to include CSS links if needed
  if (updatedCssFiles.length > 0) {
    console.log(`Found ${updatedCssFiles.length} CSS files: ${updatedCssFiles.join(', ')}`);
    
    htmlFiles.forEach(htmlFile => {
      let content = fs.readFileSync(htmlFile, 'utf8');
      const cssLinks = content.match(/<link[^>]*\.css[^>]*>/g) || [];
      
      if (cssLinks.length === 0) {
        console.log(`No CSS links found in ${htmlFile}. Adding them...`);
        
        // Manually inject the CSS links
        const cssLinkTags = updatedCssFiles.map(file => 
          `<link rel="stylesheet" href="/farmers-market-directory/_next/static/css/${file}" crossorigin="anonymous">`
        ).join('\n');
        
        const updatedHtml = content.replace('</head>', `${cssLinkTags}\n</head>`);
        fs.writeFileSync(htmlFile, updatedHtml);
        console.log(`Added CSS links to ${htmlFile}`);
      }
    });
  } else {
    console.error('Still no CSS files found after attempting to copy from .next directory!');
  }
} else {
  console.error('Output directory not found:', outDir);
}

console.log('Post-build CSS processing complete'); 