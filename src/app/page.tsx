'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
    window.location.href = `/markets?zip=${searchParams.zip}&radius=${searchParams.radius}`;
  };

  return (
    <>
      {/* Hero Banner */}
      <div className="relative h-[75vh] min-h-[600px] w-full">
        {/* Background Image - Artisan Sourdough Bread */}
        <div className="absolute inset-0">
          <Image 
            src="/images/artisan-sourdough-hero.jpg" 
            alt="Rustic artisan sourdough bread"
            fill
            priority
            className="object-cover object-center"
          />
          {/* Subtle Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/25 to-transparent"></div>
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-4 h-full relative z-10">
          <div className="flex flex-col md:flex-row h-full items-center">
            {/* Left side - Title */}
            <div className="md:w-2/5 md:pr-4 flex flex-col justify-center h-full py-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-montserrat leading-tight drop-shadow-lg">
                <span className="text-amber-200">Farmers Markets</span> <br />
                Near You
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-xl mt-6 drop-shadow-md">
                Discover fresh, locally-grown produce, artisanal foods, and handcrafted goods 
                at farmers markets in your community.
              </p>
            </div>
            
            {/* Center space - intentionally empty */}
            <div className="md:w-1/5 hidden md:block">
              {/* This is an empty div to create space */}
            </div>
            
            {/* Right side - Search Panel that overlays the bread image */}
            <div className="md:w-2/5 flex justify-end items-center mt-8 md:mt-0 relative z-20">
              {/* Semi-transparent search panel with the bread visible underneath */}
              <div className="relative w-full max-w-md p-8 rounded-xl border border-earth-soil/40" 
                   style={{
                     background: 'rgba(120, 53, 15, 0.2)',
                     backdropFilter: 'blur(8px)',
                     boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)'
                   }}>
                {/* Content wrapper */}
                <div className="relative z-10">
                  <h2 className="text-white text-xl font-semibold mb-4 drop-shadow-sm">Search Markets</h2>
                  <form onSubmit={handleSearch} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="zip" className="block text-sm font-medium text-white drop-shadow-sm">
                        Enter Your ZIP Code
                      </label>
                      <input
                        id="zip"
                        name="zip"
                        type="text"
                        required
                        pattern="[0-9]{5}"
                        placeholder="e.g. 90210"
                        className="block w-full rounded-lg shadow-sm 
                                 focus:border-primary focus:ring-primary text-earth-bark bg-white/70"
                        value={searchParams.zip}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="radius" className="block text-sm font-medium text-white drop-shadow-sm">
                        Search Radius (miles)
                      </label>
                      <input
                        id="radius"
                        name="radius"
                        type="number"
                        min="1"
                        max="100"
                        className="block w-full rounded-lg shadow-sm 
                                 focus:border-primary focus:ring-primary text-earth-bark bg-white/70"
                        value={searchParams.radius}
                        onChange={handleInputChange}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-accent-greens/85 hover:bg-accent-greens text-white py-3 px-4 rounded-lg
                               focus:outline-none focus:ring-2 focus:ring-accent-greens focus:ring-offset-2 
                               transition-colors font-medium text-center shadow-sm"
                      style={{ backdropFilter: 'blur(4px)' }}
                    >
                      Find Farmers Markets
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Benefits section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-12 text-center text-earth-bark font-montserrat">
            The Benefits of Farmers Markets
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="card p-6 border-t-4 border-t-accent-greens hover:shadow-lg transition-shadow">
              <div className="mb-4 text-accent-greens">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3 text-earth-bark">Fresh Local Produce</h3>
              <p className="text-stone-700">
                Support local farmers and enjoy the freshest seasonal fruits and vegetables, 
                often harvested just hours before the market.
              </p>
            </div>
            
            <div className="card p-6 border-t-4 border-t-accent-carrot hover:shadow-lg transition-shadow">
              <div className="mb-4 text-accent-carrot">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3 text-earth-bark">Meet Your Farmers</h3>
              <p className="text-stone-700">
                Connect directly with the people who grow your food. Learn about sustainable 
                farming practices and build community relationships.
              </p>
            </div>
            
            <div className="card p-6 border-t-4 border-t-accent-tomato hover:shadow-lg transition-shadow">
              <div className="mb-4 text-accent-tomato">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3 text-earth-bark">Support Local Economy</h3>
              <p className="text-stone-700">
                Your purchases directly support local businesses and strengthen your community,
                keeping dollars circulating in your local economy.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured markets section */}
      <section className="py-16 bg-earth-sand">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-2 text-center text-earth-bark font-montserrat">
            Explore Farmers Markets Nationwide
          </h2>
          <p className="text-center mb-12 text-stone-700 max-w-2xl mx-auto">
            From coast to coast, farmers markets offer a diverse array of local produce, artisanal foods, 
            and crafts that reflect regional specialties and cultural traditions.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="card overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 relative">
                <Image
                  src="/images/farmers-market.jpg"
                  alt="Western farmers market with beautiful produce"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary-dark/70 flex items-end justify-center p-4">
                  <span className="text-white text-3xl font-montserrat font-semibold">West</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-earth-bark mb-2">Western Markets</h3>
                <p className="text-stone-700 text-sm">
                  Explore markets featuring fresh seafood, citrus, avocados and other Pacific favorites.
                </p>
              </div>
            </div>
            
            <div className="card overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 relative">
                <Image
                  src="/images/organic-produce.jpg"
                  alt="Midwest farmers market with colorful fresh vegetables"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-accent-greens/70 flex items-end justify-center p-4">
                  <span className="text-white text-3xl font-montserrat font-semibold">Midwest</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-earth-bark mb-2">Midwest Markets</h3>
                <p className="text-stone-700 text-sm">
                  Discover hearty root vegetables, sweet corn, apples and local cheeses.
                </p>
              </div>
            </div>
            
            <div className="card overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 relative">
                <Image
                  src="/images/southern-produce.jpg"
                  alt="Southern farmers market with regional specialties"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-accent-carrot/70 flex items-end justify-center p-4">
                  <span className="text-white text-3xl font-montserrat font-semibold">South</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-earth-bark mb-2">Southern Markets</h3>
                <p className="text-stone-700 text-sm">
                  Sample sweet peaches, okra, collard greens and other Southern specialties.
                </p>
              </div>
            </div>
            
            <div className="card overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 relative">
                <Image
                  src="/images/farmers-market-2.jpg"
                  alt="Eastern farmers market with seasonal produce"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-accent-tomato/70 flex items-end justify-center p-4">
                  <span className="text-white text-3xl font-montserrat font-semibold">East</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-earth-bark mb-2">Eastern Markets</h3>
                <p className="text-stone-700 text-sm">
                  Find Atlantic seafood, maple syrup, cranberries and farm-fresh dairy.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/markets" 
              className="inline-flex items-center py-3 px-6 bg-white text-primary border border-primary
                        hover:bg-primary hover:text-white rounded-lg transition-colors shadow-sm font-medium"
            >
              View All Markets
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      
      {/* SEO content section with image */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="md:w-1/2 order-2 md:order-1">
                <h2 className="text-3xl font-semibold mb-6 text-earth-bark font-montserrat">
                  About Farmers Markets
                </h2>
                
                <div className="prose prose-stone">
                  <p>
                    Farmers markets are vibrant community gatherings where local farmers, producers, and artisans 
                    come together to sell their goods directly to consumers. These markets play a crucial role in 
                    our food system by providing fresh, seasonal produce and supporting sustainable agriculture.
                  </p>
                  
                  <p>
                    At farmers markets, you'll find a wide variety of fresh fruits and vegetables, often harvested 
                    within 24 hours of the market. Beyond produce, many markets feature vendors selling meats, eggs, 
                    dairy products, baked goods, honey, jams, flowers, and handcrafted items.
                  </p>
                  
                  <p>
                    Shopping at farmers markets helps stimulate local economies by keeping dollars within the community. 
                    It also reduces the environmental impact of food distribution by cutting down transportation distances 
                    and supporting sustainable farming practices.
                  </p>
                </div>
              </div>
              
              <div className="md:w-1/2 order-1 md:order-2">
                <div className="relative rounded-lg overflow-hidden shadow-xl">
                  <Image 
                    src="/images/crop-field.jpg" 
                    alt="Scenic view of a local crop field at sunset"
                    width={600}
                    height={400}
                    className="object-cover w-full h-[400px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-12 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-earth-bark font-montserrat">
            Ready to discover farmers markets near you?
          </h2>
          <p className="text-lg text-stone-700 mb-8 max-w-2xl mx-auto">
            Use our farmers market directory to find markets in your area and experience 
            the vibrant atmosphere that makes these community institutions so special.
          </p>
          <Link 
            href="/markets" 
            className="inline-flex items-center py-3 px-8 bg-primary text-white
                     hover:bg-primary-light rounded-lg transition-colors shadow-md font-medium text-lg"
          >
            Find Markets Now
          </Link>
        </div>
      </section>
    </>
  );
}
