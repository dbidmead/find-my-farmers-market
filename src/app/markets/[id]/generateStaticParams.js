// Generate some placeholder market IDs for static export
// This list could be populated from an API call during build time
// For now, just using a few sample IDs so that some paths work
export function generateStaticParams() {
  return [
    { id: '1000006' }, // Example IDs that might exist
    { id: '1000007' },
    { id: '1000008' },
    { id: '1000009' },
    { id: '1000010' },
  ];
} 