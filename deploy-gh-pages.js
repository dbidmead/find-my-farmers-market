const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting deployment to GitHub Pages...');

try {
  // Clean up any existing build artifacts
  console.log('Cleaning up...');
  try {
    fs.rmSync('.next', { recursive: true, force: true });
    fs.rmSync('out', { recursive: true, force: true });
  } catch (e) {
    console.log('No previous build files to clean.');
  }

  // Set environment to production
  process.env.NODE_ENV = 'production';
  
  // Run Next.js build
  console.log('Building Next.js app...');
  execSync('next build', { stdio: 'inherit' });
  
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

  // Inject the SPA script into index.html
  try {
    let indexPath = './out/index.html';
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    if (!indexContent.includes('Single Page App routing')) {
      indexContent = indexContent.replace('</head>', scriptForSPA + '</head>');
      fs.writeFileSync(indexPath, indexContent);
    }
  } catch (e) {
    console.log('Unable to modify index.html, it might not exist yet.');
  }

  // Deploy to GitHub Pages
  console.log('Deploying to GitHub Pages...');
  execSync('npx gh-pages -d out', { stdio: 'inherit' });

  console.log('Deployment complete! Your site should be live shortly.');
} catch (error) {
  console.error('Deployment failed:', error);
  process.exit(1);
} 