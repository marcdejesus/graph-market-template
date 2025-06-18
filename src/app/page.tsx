import { Button, Card, CardContent, CardTitle, Badge } from '@/components/ui'
import { MainLayout } from '@/components/layout'

export default function HomePage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-steel-800 text-white">
        <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="outline" className="mb-6 bg-white/10 text-white border-white/20">
              New Collection Available
            </Badge>
            <h1 className="text-5xl font-bebas font-bold tracking-tight mb-6 lg:text-7xl">
              Elevate Your
              <span className="block text-performance-400">Performance</span>
            </h1>
            <p className="mx-auto max-w-3xl text-xl text-steel-300 mb-8 leading-relaxed">
              Premium athletic wear engineered for the modern athlete. Experience the perfect fusion 
              of performance, style, and innovation with FitMarket&apos;s cutting-edge collection.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" variant="performance" className="text-lg px-8 py-4">
                Shop Collection
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary-900">
                Our Story
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-steel-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bebas font-bold text-primary-900 mb-4">
              Built for Champions
            </h2>
            <p className="text-lg text-steel-600 max-w-2xl mx-auto">
              Every piece is crafted with precision engineering and athlete-tested materials
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card variant="elevated" className="text-center">
              <CardContent className="pt-8">
                <div className="mb-6">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-performance-100">
                    <PerformanceIcon className="h-8 w-8 text-performance-600" />
                  </div>
                </div>
                <CardTitle className="mb-4">Performance First</CardTitle>
                <p className="text-steel-600">
                  Advanced moisture-wicking fabrics and ergonomic designs that move with your body
                </p>
              </CardContent>
            </Card>

            <Card variant="elevated" className="text-center">
              <CardContent className="pt-8">
                <div className="mb-6">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-success-100">
                    <SustainabilityIcon className="h-8 w-8 text-success-600" />
                  </div>
                </div>
                <CardTitle className="mb-4">Sustainable Materials</CardTitle>
                <p className="text-steel-600">
                  Eco-friendly fabrics made from recycled materials without compromising quality
                </p>
              </CardContent>
            </Card>

            <Card variant="elevated" className="text-center">
              <CardContent className="pt-8">
                <div className="mb-6">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-energy-100">
                    <InnovationIcon className="h-8 w-8 text-energy-600" />
                  </div>
                </div>
                <CardTitle className="mb-4">Innovation</CardTitle>
                <p className="text-steel-600">
                  Cutting-edge technology integrated into every stitch for maximum performance
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bebas font-bold text-primary-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-steel-600">
              Find the perfect gear for every workout
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Card key={category.name} className="group cursor-pointer hover:shadow-lg transition-all duration-300">
                <div className="aspect-square bg-gradient-to-br from-steel-100 to-steel-200 rounded-t-xl"></div>
                <CardContent className="text-center">
                  <h3 className="font-semibold text-lg text-primary-900 group-hover:text-performance-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-steel-600 text-sm mt-1">
                    {category.count} products
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-900 text-white py-20">
        <div className="mx-auto max-w-4xl text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bebas font-bold mb-6">
            Ready to Transform Your Training?
          </h2>
          <p className="text-xl text-steel-300 mb-8 leading-relaxed">
            Join thousands of athletes who have elevated their performance with FitMarket gear. 
            Experience the difference premium athletic wear makes.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" variant="performance" className="text-lg px-8 py-4">
              Start Shopping
            </Button>
            <Button size="lg" variant="ghost" className="text-lg px-8 py-4 text-white hover:bg-white/10">
              View Size Guide
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}

// Sample data
const categories = [
  { name: 'Tops', count: 24 },
  { name: 'Bottoms', count: 18 },
  { name: 'Outerwear', count: 12 },
  { name: 'Accessories', count: 15 },
]

// Simple SVG icons
function PerformanceIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  )
}

function SustainabilityIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  )
}

function InnovationIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  )
} 