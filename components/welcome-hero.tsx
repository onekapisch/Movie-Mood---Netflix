"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FilmIcon, HeartIcon, SparklesIcon } from "lucide-react"
import { useRouter } from "next/navigation"

export default function WelcomeHero() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleGetStarted = () => {
    setIsLoading(true)
    router.push("/recommendations")
  }

  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-netflix-dark">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-netflix-red/5 to-netflix-black"></div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${i % 2 === 0 ? "bg-netflix-red/10" : "bg-gray-800/20"}`}
            style={{
              width: `${Math.random() * 200 + 50}px`,
              height: `${Math.random() * 200 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="container px-4 relative">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center bg-black/50 rounded-full px-4 py-2 mb-4 border border-gray-800">
            <SparklesIcon className="h-4 w-4 text-netflix-red mr-2" />
            <span className="text-sm font-medium text-white">Your personal movie guide</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
            Find movies based on your <span className="text-netflix-red">mood</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400">
            MovieMood helps you discover the perfect movie or show for how you're feeling right now. No more endless
            scrolling.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              className="gap-2 bg-netflix-red hover:bg-netflix-red/90 text-white"
              onClick={handleGetStarted}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Get Recommendations"}
              <HeartIcon className="h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 border-gray-700 text-white hover:bg-gray-800"
              onClick={() => router.push("/discover")}
            >
              Browse Categories
              <FilmIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
