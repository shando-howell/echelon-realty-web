import Image from 'next/image';
import HeroText from './components/HeroText';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Static Background Image - Server Rendered */}
        <div className="absolute inset-0 z-0 bg-gray-900">
          <Image
            src="/images/placeholder-property.jpg"
            alt="Home Page Image"
            fill
            className="object-cover opacity-60"
            priority
            unoptimized
          />
        </div>

        <HeroText />
      </section>

      {/* Technical Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800">Enterprise-Grade Architecture</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Built from the gound up for high performance.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 hover:shdow-md
            transition-shadow">
              <div className="w-12 h-12 bg-blue-200 rounded-xl flex items-center justify-center mb-6">
                <span className="text-blue-600 text-2xl">🌍</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">PostGIS Spatial Search</h3>
              <p className="text-gray-600">
                Native geometric querying allows for highly accurate, Earth-curvature adjusted radius
                searches directly within the database layer.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 hover:shdow-md
            transition-shadow">
              <div className="w-12 h-12 bg-blue-200 rounded-xl flex items-center justify-center mb-6">
                <span className="text-blue-600 text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Rapid Page Loads</h3>
              <p className="text-gray-600">
                Leveraging React Server Components for optimal SEO and rapid initial page loads.
                Integrates a dynamic client-side map.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 hover:shdow-md
            transition-shadow">
              <div className="w-12 h-12 bg-blue-200 rounded-xl flex items-center justify-center mb-6">
                <span className="text-blue-600 text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Robust API</h3>
              <p className="text-gray-600">
                A Node.js server implemented with TypeScript, handling data payloads
                and secure cross-origin resource sharing.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}