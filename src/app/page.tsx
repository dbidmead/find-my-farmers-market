'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SearchParams } from '../types';

export default function Home() {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    zip: '',
    radius: 20,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // We'll implement the search functionality in the next step
    window.location.href = `/markets?zip=${searchParams.zip}&radius=${searchParams.radius}`;
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-8 mt-20 text-center text-gray-800">
        Find Farmers Markets Near You
      </h1>
      
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
              Enter Your ZIP Code
            </label>
            <input
              id="zip"
              name="zip"
              type="text"
              required
              pattern="[0-9]{5}"
              placeholder="e.g. 90210"
              className="block w-full rounded-md border-gray-300 shadow-sm 
                         focus:border-green-500 focus:ring-green-500 p-2 border text-gray-800"
              value={searchParams.zip}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="radius" className="block text-sm font-medium text-gray-700">
              Search Radius (miles)
            </label>
            <input
              id="radius"
              name="radius"
              type="number"
              min="1"
              max="100"
              className="block w-full rounded-md border-gray-300 shadow-sm 
                         focus:border-green-500 focus:ring-green-500 p-2 border text-gray-800"
              value={searchParams.radius}
              onChange={handleInputChange}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md
                       hover:bg-green-700 focus:outline-none focus:ring-2
                       focus:ring-green-500 focus:ring-offset-2"
          >
            Search Markets
          </button>
        </form>
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Why Visit Farmers Markets?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-2 text-gray-800">Fresh Local Produce</h3>
            <p className="text-gray-700">Support local farmers and enjoy the freshest seasonal fruits and vegetables.</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-2 text-gray-800">Connect with Growers</h3>
            <p className="text-gray-700">Meet the people who grow your food and learn about sustainable farming practices.</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-2 text-gray-800">Support Local Economy</h3>
            <p className="text-gray-700">Your purchases directly support local businesses and strengthen your community.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
