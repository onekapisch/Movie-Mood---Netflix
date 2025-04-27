import Layout from "@/components/netflix-layout"
import WelcomeHero from "@/components/welcome-hero"
import RecommendationEngine from "@/components/recommendation-engine"
import HowItWorks from "@/components/how-it-works"
import FeaturedMovies from "@/components/featured-movies"

export default function Home() {
  return (
    <Layout>
      {/* Clear Welcome Hero with Value Proposition */}
      <WelcomeHero />

      {/* Main Recommendation Engine - Core Feature */}
      <section className="py-12 bg-secondary/50">
        <div className="container px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Find Your Perfect Movie Match</h2>
          <RecommendationEngine />
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Featured Content Section */}
      <FeaturedMovies />
    </Layout>
  )
}
