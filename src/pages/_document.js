import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  const isProduction = process.env.NODE_ENV === 'production';
  const basePath = isProduction ? '/farmers-market-directory' : '';

  return (
    <Html lang="en">
      <Head>
        {/* Force correct base path for asset loading */}
        {isProduction && <base href={`${basePath}/`} />}
      </Head>
      <body>
        <Main />
        <NextScript />
        {/* Add script to fix chunk loading errors */}
        {isProduction && (
          <script dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Fix for chunk loading errors
                const originalFetch = window.fetch;
                window.fetch = function(url, options) {
                  if (typeof url === 'string' && url.includes('/_next/static/chunks/')) {
                    // Ensure chunks have the correct base path
                    if (!url.startsWith('${basePath}')) {
                      url = '${basePath}' + url;
                    }
                    // Fix any double slashes in the URL
                    url = url.replace(/\\/\\//g, '/');
                  }
                  return originalFetch(url, options);
                };
                
                // Patch webpack chunk loading
                const originalWebpackLoad = window.__webpack_require__.e;
                window.__webpack_require__.e = function(chunkId) {
                  return originalWebpackLoad(chunkId).catch(error => {
                    console.error('Chunk load error:', error);
                    // Try again with the correct path
                    if (error.target && error.target.src) {
                      const src = error.target.src;
                      if (src.includes('_next/static/chunks/') && !src.startsWith('${basePath}')) {
                        const newSrc = '${basePath}' + src;
                        console.log('Retrying with corrected path:', newSrc);
                        error.target.src = newSrc;
                      }
                    }
                    throw error;
                  });
                };
              })();
            `
          }} />
        )}
      </body>
    </Html>
  );
} 