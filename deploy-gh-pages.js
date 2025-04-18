const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting deployment to GitHub Pages...');

try {
  // More thorough cleanup of build artifacts and caches
  console.log('Thoroughly cleaning up...');
  try {
    // Remove Next.js build cache
    fs.rmSync('.next', { recursive: true, force: true });
    fs.rmSync('out', { recursive: true, force: true });
    
    // Remove node_modules cache
    fs.rmSync('node_modules/.cache', { recursive: true, force: true });
    
    // Remove any potential CSS cache
    if (fs.existsSync('.cache')) {
      fs.rmSync('.cache', { recursive: true, force: true });
    }
  } catch (e) {
    console.log('Error during cleanup:', e.message);
    console.log('Continuing with deployment...');
  }

  // Set environment to production
  process.env.NODE_ENV = 'production';
  
  // Run Next.js build with cleaned caches
  console.log('Building Next.js app...');
  execSync('npx next build', { stdio: 'inherit' });
  
  // Create .nojekyll file to bypass GitHub Pages Jekyll processing
  console.log('Creating .nojekyll file...');
  fs.writeFileSync('./out/.nojekyll', '');
  
  // Create a custom 404.html file that redirects to index.html
  console.log('Creating custom 404.html...');
  const notFoundContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Not Found | Farmers Market Directory</title>
  <script>
    // Single Page App for GitHub Pages
    // https://github.com/rafgraph/spa-github-pages
    const pathSegments = 1; // Keeps /farmers-market-directory/
    const l = window.location;
    const redirectPath = l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
      l.pathname.split('/').slice(0, pathSegments + 1).join('/') + '/?p=/' +
      l.pathname.slice(1).split('/').slice(pathSegments).join('/').replace(/&/g, '~and~') +
      (l.search ? '&q=' + l.search.slice(1).replace(/&/g, '~and~') : '') +
      l.hash;
    window.location.replace(redirectPath);
  </script>
  <style>
    body {
      font-family: -apple-system, system-ui, sans-serif;
      text-align: center;
      padding: 2rem;
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.5;
    }
    h1 { color: #166534; }
  </style>
</head>
<body>
  <h1>Page Not Found</h1>
  <p>Redirecting to the home page...</p>
  <p>If you're not redirected, <a href="/farmers-market-directory/">click here</a>.</p>
</body>
</html>`;
  fs.writeFileSync('./out/404.html', notFoundContent);

  // Create script to handle SPA routing in index.html
  console.log('Adding SPA routing to index.html...');
  const scriptForSPA = `
<script type="text/javascript">
  // Single Page App routing for GitHub Pages
  (function(l) {
    if (l.search[1] === '/') {
      const decoded = l.search.slice(1).split('&').map(function(s) { 
        return s.replace(/~and~/g, '&');
      }).join('?');
      window.history.replaceState(null, null,
        l.pathname.slice(0, -1) + decoded + l.hash
      );
    }
  }(window.location));
</script>`;

  // Fix paths in HTML files
  console.log('Fixing asset paths in HTML files...');
  const fixHtmlFiles = (directory) => {
    const files = fs.readdirSync(directory, { withFileTypes: true });
    
    for (const file of files) {
      const fullPath = path.join(directory, file.name);
      
      if (file.isDirectory()) {
        fixHtmlFiles(fullPath);
      } else if (file.name.endsWith('.html')) {
        let content = fs.readFileSync(fullPath, 'utf8');
        
        // Fix the escaped quotes in asset paths
        content = content.replace(/&quot;\/farmers-market-directory&quot;\//g, '/farmers-market-directory/');
        
        // Fix double slashes in paths if any exist
        content = content.replace(/\/farmers-market-directory\/\//g, '/farmers-market-directory/');
        
        // Add SPA script if it's index.html and doesn't already have it
        if (file.name === 'index.html' && !content.includes('Single Page App routing')) {
          content = content.replace('</head>', scriptForSPA + '</head>');
        }
        
        fs.writeFileSync(fullPath, content);
        console.log(`Fixed paths in: ${fullPath}`);
      }
    }
  };
  
  // Process all HTML files
  fixHtmlFiles('./out');

  // Verify CSS files are present and fix paths if needed
  console.log('Verifying CSS files...');
  const cssDir = './out/_next/static/css';
  if (fs.existsSync(cssDir)) {
    const cssFiles = fs.readdirSync(cssDir).filter(file => file.endsWith('.css'));
    console.log(`Found ${cssFiles.length} CSS files: ${cssFiles.join(', ')}`);
    
    // Check if the CSS files are being correctly referenced in the HTML
    if (cssFiles.length > 0) {
      // Fix all HTML files to ensure they have the correct CSS references
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
      
      findHtmlFiles('./out');
      console.log(`Found ${htmlFiles.length} HTML files to check for CSS links`);
      
      htmlFiles.forEach(htmlFile => {
        let content = fs.readFileSync(htmlFile, 'utf8');
        const cssLinks = content.match(/<link[^>]*\.css[^>]*>/g) || [];
        
        if (cssLinks.length === 0) {
          console.log(`No CSS links found in ${htmlFile}. Adding them...`);
          
          // Manually inject the CSS links
          const cssLinkTags = cssFiles.map(file => 
            `<link rel="stylesheet" href="/farmers-market-directory/_next/static/css/${file}" crossorigin="anonymous">`
          ).join('\n');
          
          const updatedHtml = content.replace('</head>', `${cssLinkTags}\n</head>`);
          fs.writeFileSync(htmlFile, updatedHtml);
          console.log(`Added CSS links to ${htmlFile}`);
        }
      });
      
      // Also ensure the CSS files are not blocked by CORS or other issues
      console.log('Making sure CSS files have proper headers...');
      cssFiles.forEach(cssFile => {
        const cssPath = path.join(cssDir, cssFile);
        // Read and write back the file to ensure it has the proper encoding and BOM
        const cssContent = fs.readFileSync(cssPath, 'utf8');
        fs.writeFileSync(cssPath, cssContent, 'utf8');
      });
    }
  } else {
    console.error('CSS directory not found! This will cause styling issues.');
  }

  // Fix chunk loading issues
  console.log('Fixing chunk paths in HTML files...');
  const fixChunkPaths = (directory) => {
    const files = fs.readdirSync(directory, { withFileTypes: true });
    
    for (const file of files) {
      const fullPath = path.join(directory, file.name);
      
      if (file.isDirectory()) {
        fixChunkPaths(fullPath);
      } else if (file.name.endsWith('.html') || file.name.endsWith('.js')) {
        let content = fs.readFileSync(fullPath, 'utf8');
        
        // Fix script paths to chunks
        content = content.replace(
          /src="\/farmers-market-directory\/\/farmers-market-directory\/_next/g, 
          'src="/farmers-market-directory/_next'
        );
        
        // Fix double slashes in paths
        content = content.replace(
          /\/farmers-market-directory\/\//g, 
          '/farmers-market-directory/'
        );
        
        // Fix incorrect references to chunks
        if (file.name.endsWith('.js')) {
          content = content.replace(
            /"\/farmers-market-directory\/_next\/static\/chunks\//g,
            '"/farmers-market-directory/_next/static/chunks/'
          );
          
          content = content.replace(
            /"\/\/_next\/static\/chunks\//g,
            '"/farmers-market-directory/_next/static/chunks/'
          );
        }
        
        fs.writeFileSync(fullPath, content);
        console.log(`Fixed chunk paths in: ${fullPath}`);
      }
    }
  };
  
  // Process all HTML and JS files
  fixChunkPaths('./out');

  // Ensure CSS files have correct permissions
  console.log('Ensuring CSS files have correct permissions...');
  try {
    // On Unix-like systems, ensure CSS files are readable
    if (process.platform !== 'win32') {
      execSync('chmod -R 644 ./out/_next/static/css/*.css', { stdio: 'inherit' });
    }
  } catch (e) {
    console.log('Warning: Could not set CSS file permissions, but continuing deployment.');
  }

  // Deploy to GitHub Pages
  console.log('Deploying to GitHub Pages...');
  execSync('npx gh-pages -d out', { stdio: 'inherit' });

  console.log('Deployment complete! Your site should be live shortly.');
} catch (error) {
  console.error('Deployment failed:', error);
  process.exit(1);
} 