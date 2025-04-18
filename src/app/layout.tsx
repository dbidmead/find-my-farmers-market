import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Farmers Market Directory",
  description: "Find local farmers markets near you using the USDA Farmers Market Directory",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <header className="bg-green-800 text-white p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <a href="/" className="text-xl font-bold text-white">Farmers Market Directory</a>
          </div>
        </header>
        <div className="text-gray-800">
          {children}
        </div>
        <footer className="bg-green-800 text-white py-6 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-white">Data provided by the USDA Farmers Market Directory API</p>
            <p className="text-sm mt-2 text-white">© {new Date().getFullYear()} Farmers Market Directory</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
