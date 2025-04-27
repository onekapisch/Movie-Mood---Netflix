"use client"

import { useState, useEffect } from "react"
import { Play, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Movie {
  id: number
  title: string
  backdrop_path: string
  overview: string
}

export default function HeroBanner() {
  const [movie, setMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeaturedMovie() {
      try {
        const response = await fetch("/api/tmdb?endpoint=trending/movie/week")
        const data = await response.json()

        if (data.results && data.results.length > 0) {
          // Get a random movie from the top 10
          const randomIndex = Math.floor(Math.random() * Math.min(10, data.results.length))
          setMovie(data.results[randomIndex])
        }
      } catch (error) {
        console.error("Error fetching featured movie:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedMovie()
  }, [])

  if (loading || !movie) {
    return (
      <div className="relative h-[70vh] bg-netflix-black">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-[70vh]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 netflix-gradient"></div>
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex flex-col justify-end pb-20">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 max-w-2xl netflix-title">{movie.title}</h1>
        <p className="text-lg max-w-xl mb-6 line-clamp-3">{movie.overview}</p>
        <div className="flex gap-4">
          <Button className="netflix-button" size="lg">
            <Play className="mr-2 h-5 w-5" /> Play
          </Button>
          <Button variant="outline" size="lg">
            <Info className="mr-2 h-5 w-5" /> More Info
          </Button>
        </div>
      </div>
    </div>
  )
}
