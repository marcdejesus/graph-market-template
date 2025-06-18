export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 to-steel-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="heading-display mb-6 text-balance">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-performance-500 to-energy-500 bg-clip-text text-transparent">
              FitMarket
            </span>
          </h1>
          <p className="text-body mx-auto max-w-2xl mb-8">
            Discover premium gym clothes designed for performance and style.
            Your journey to peak athletic performance starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary">
              Shop Collection
            </button>
            <button className="btn-secondary">
              Learn More
            </button>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="card max-w-2xl mx-auto">
            <h2 className="heading-section mb-4">Project Initialized</h2>
            <p className="text-body">
              ✅ Next.js 14 with TypeScript configured<br />
              ✅ Tailwind CSS with custom design system<br />
              ✅ ESLint and Prettier setup<br />
              ✅ Environment configuration ready<br />
              ✅ Project structure established
            </p>
          </div>
        </div>
      </div>
    </main>
  );
} 