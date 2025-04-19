import Link from 'next/link';
import { getAssetPath } from '../utils/assetPath';

function Error({ statusCode }: { statusCode?: number }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          {statusCode ? `Error ${statusCode}` : 'Client Error'}
        </h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Something went wrong
        </h2>
        <p className="text-gray-600 mb-8">
          {statusCode
            ? `An error ${statusCode} occurred on the server`
            : 'An error occurred on the client'}
        </p>
        <a href="/" className="inline-block bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700">
          Go back home
        </a>
      </div>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: { res?: { statusCode: number }; err?: { statusCode: number } }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error; 