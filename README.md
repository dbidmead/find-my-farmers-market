# Farmers Market Directory

A web application to help users find farmers markets near them using the USDA Farmers Market API.

## Features

- Search for farmers markets by location
- View market details including hours, products, and more
- Interactive map display of market locations
- Mobile-friendly responsive design

## Technologies

- Next.js
- React
- TypeScript
- Tailwind CSS
- USDA Farmers Market API

## Getting Started

### Prerequisites

- Node.js 18.16.0 or later
- API key for the USDA Farmers Market API

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/farmers-market-directory.git
cd farmers-market-directory
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your USDA API key:
```
NEXT_PUBLIC_USDA_API_KEY=your_api_key_here
```

4. Start the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Development

The application will automatically refresh when you make changes to the code.

## License

MIT
