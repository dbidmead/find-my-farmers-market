import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const montserrat = Montserrat({ subsets: ["latin"], variable: '--font-montserrat' });

export const metadata = {
  title: "Find my Farmers Market | Local Markets Near You",
  description: "Discover farmers markets in your area. Support local farmers, enjoy fresh produce and connect with your community. Search by zip code and radius.",
  keywords: "farmers market, local produce, organic food, farm fresh, sustainable farming",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/farm-basket-logo.svg" />
      </head>
      <body className={`${inter.variable} ${montserrat.variable} font-sans bg-stone-50 min-h-screen`}>
        <header className="bg-gradient-to-r from-accent-greens via-accent-greens/60 to-transparent text-white shadow-lg">
          <div className="container mx-auto flex justify-between items-center py-4 px-4 md:px-8">
            <a href="/" className="text-xl md:text-2xl font-bold text-white font-montserrat flex items-center">
              <img src="/farm-basket-logo.svg" alt="Farmers Market Basket" className="h-8 md:h-10 mr-2" />
              <span className="text-amber-200 mr-1">Find my</span> Farmers Market
            </a>
            <nav>
              <ul className="flex space-x-6">
                <li><a href="/" className="text-accent-greens font-medium hover:font-bold transition-all duration-200 py-1 border-b-2 border-transparent hover:border-accent-greens">Home</a></li>
                <li><a href="/markets" className="text-accent-greens font-medium hover:font-bold transition-all duration-200 py-1 border-b-2 border-transparent hover:border-accent-greens">Markets</a></li>
              </ul>
            </nav>
          </div>
        </header>
        <div>
          {children}
        </div>
        <footer className="bg-amber-900 text-white py-8 mt-12">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Find my Farmers Market</h3>
                <p className="text-amber-100">Connecting communities with fresh, local produce since 2023</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-amber-100 hover:text-white transition-colors">About Us</a></li>
                  <li><a href="#" className="text-amber-100 hover:text-white transition-colors">Vendor Information</a></li>
                  <li><a href="#" className="text-amber-100 hover:text-white transition-colors">Seasonal Guide</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Data Sources</h3>
                <p className="text-amber-100">Data provided by the USDA Farmers Market Directory API</p>
                <p className="text-sm mt-2 text-amber-100">© {new Date().getFullYear()} Find my Farmers Market</p>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
