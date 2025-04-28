import type { Metadata } from "next"
import Layout from "@/components/netflix-layout"
import RecommendationEngine from "@/components/recommendation-engine"

export const metadata: Metadata = {
  title: "Get Recommendations - MovieMood",
  description: "Find personalized movie recommendations based on your mood and preferences.",
}

export default function RecommendationsPage() {
  return (
    <Layout>
      <section className="py-16">
        <div className="container px-4">
          <h1 className="text-3xl font-bold mb-8 text-center">Get Movie Recommendations</h1>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            Tell us how you're feeling, select your preferences, and we'll find the perfect movie or TV show for your
            current mood.
          </p>

          <RecommendationEngine />
        </div>
      </section>
    </Layout>
  )
}
