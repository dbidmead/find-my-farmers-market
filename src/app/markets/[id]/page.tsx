import Link from 'next/link';
import ClientMarketDetail from './client';

// Generate static params for the build
export function generateStaticParams() {
  return [
    { id: '1000006' }, // Example IDs that might exist
    { id: '1000007' },
    { id: '1000008' },
    { id: '1000009' },
    { id: '1000010' },
  ];
}

// This is a Server Component
export default function MarketDetailPage({ params }: { params: { id: string } }) {
  const marketId = params.id;

  // Server components can't use hooks like useState
  // Instead, we pass the ID to a client component
  return <ClientMarketDetail marketId={marketId} />;
} 