"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, RefreshCcw } from "lucide-react"
import Link from "next/link"

interface Movie {
  id: number
  title: string
  poster_path: string
  vote_average: number
}

export default function FeaturedMovies() {
  const [trending, setTrending] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [country, setCountry] = useState("us")
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    // Listen for country changes
    const handleCountryChange = (event: Event) => {
      const customEvent = event as CustomEvent
      setCountry(customEvent.detail)
    }

    window.addEventListener("countrychange", handleCountryChange)

    // Load initial country from localStorage
    const savedCountry = localStorage.getItem("selectedCountry")
    if (savedCountry) {
      setCountry(savedCountry)
    }

    return () => {
      window.removeEventListener("countrychange", handleCountryChange)
    }
  }, [])

  useEffect(() => {
    async function fetchTrending() {
      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams()
        params.append("region", country.toUpperCase())

        const response = await fetch(`/api/tmdb?endpoint=trending/movie/week&${params.toString()}`)

        if (!response.ok) {
          throw new Error("Failed to fetch trending movies")
        }

        const data = await response.json()

        if (data.error) {
          throw new Error(data.error)
        }

        if (!data.results || data.results.length === 0) {
          setTrending([])
          return
        }

        setTrending(data.results?.slice(0, 6) || [])
      } catch (err: any) {
        console.error("Error fetching trending movies:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTrending()
  }, [country, retryCount])

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
  }

  if (loading) {
    return (
      <section className="py-16">
        <div className="container px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Popular Right Now</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-muted animate-pulse rounded-lg"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="container px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Popular Right Now</h2>
          <div className="p-6 bg-card rounded-lg border text-center">
            <p className="text-muted-foreground mb-4">Unable to load trending movies at this time.</p>
            <Button onClick={handleRetry} variant="outline" size="sm">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        </div>
      </section>
    )
  }

  if (trending.length === 0) {
    return null // Don't show this section if there are no trending movies
  }

  return (
    <section className="py-16">
      <div className="container px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Popular Right Now</h2>
          <Link href="/discover">
            <Button variant="ghost" className="gap-1">
              View all <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {trending.map((movie) => (
            <Link key={movie.id} href={`/movie/${movie.id}`}>
              <Card className="border-0 overflow-hidden card-hover">
                <CardContent className="p-0">
                  <div className="aspect-[2/3] overflow-hidden">
                    {movie.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full h-full object-cover image-hover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-2xl font-bold text-muted-foreground">{movie.title.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium truncate">{movie.title}</h3>
                    <div className="flex items-center mt-1">
                      <div className="imdb-rating text-xs">IMDb {movie.vote_average.toFixed(1)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
