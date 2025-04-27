"use client"

import { useState, useEffect } from "react"
import Layout from "@/components/netflix-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

const genres = [
  { id: "28", name: "Action" },
  { id: "12", name: "Adventure" },
  { id: "16", name: "Animation" },
  { id: "35", name: "Comedy" },
  { id: "80", name: "Crime" },
  { id: "99", name: "Documentary" },
  { id: "18", name: "Drama" },
  { id: "10751", name: "Family" },
  { id: "14", name: "Fantasy" },
  { id: "36", name: "History" },
  { id: "27", name: "Horror" },
  { id: "10402", name: "Music" },
  { id: "9648", name: "Mystery" },
  { id: "10749", name: "Romance" },
  { id: "878", name: "Science Fiction" },
  { id: "53", name: "Thriller" },
]

interface Movie {
  id: number
  title: string
  poster_path: string
  vote_average: number
  release_date: string
}

export default function DiscoverPage() {
  const [activeTab, setActiveTab] = useState<string>("trending")
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMovies() {
      setLoading(true)
      try {
        let endpoint = "trending/movie/week"

        if (activeTab === "popular") {
          endpoint = "movie/popular"
        } else if (activeTab === "top_rated") {
          endpoint = "movie/top_rated"
        } else if (activeTab === "upcoming") {
          endpoint = "movie/upcoming"
        } else if (activeTab.startsWith("genre_")) {
          const genreId = activeTab.replace("genre_", "")
          endpoint = `discover/movie?with_genres=${genreId}`
        }

        const response = await fetch(`/api/tmdb?endpoint=${endpoint}`)
        const data = await response.json()

        setMovies(data.results || [])
      } catch (error) {
        console.error("Error fetching movies:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [activeTab])

  return (
    <Layout>
      <section className="py-16">
        <div className="container px-4">
          <h1 className="text-3xl font-bold mb-8">Discover Movies</h1>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <div className="overflow-x-auto pb-2">
              <TabsList className="bg-secondary inline-flex whitespace-nowrap">
                <TabsTrigger value="trending">Trending</TabsTrigger>
                <TabsTrigger value="popular">Popular</TabsTrigger>
                <TabsTrigger value="top_rated">Top Rated</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              </TabsList>
            </div>

            <div className="mb-6">
              <h2 className="font-medium mb-3">Browse by Genre</h2>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <Button
                    key={genre.id}
                    variant="outline"
                    size="sm"
                    className={activeTab === `genre_${genre.id}` ? "bg-primary text-primary-foreground" : ""}
                    onClick={() => setActiveTab(`genre_${genre.id}`)}
                  >
                    {genre.name}
                  </Button>
                ))}
              </div>
            </div>

            <TabsContent value={activeTab} className="mt-0">
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="aspect-[2/3] bg-muted rounded-lg animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {movies.map((movie) => (
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
                                <span className="text-2xl font-bold text-muted-foreground">
                                  {movie.title.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <h3 className="font-medium truncate">{movie.title}</h3>
                            <div className="flex items-center justify-between mt-1 text-sm">
                              <div className="flex items-center">
                                <span className="text-yellow-500">★</span>
                                <span className="ml-1">{movie.vote_average.toFixed(1)}</span>
                              </div>
                              <span className="text-muted-foreground">
                                {movie.release_date?.substring(0, 4) || "N/A"}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  )
}
