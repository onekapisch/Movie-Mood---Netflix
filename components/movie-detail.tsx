"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ClockIcon, CalendarIcon, PlayCircleIcon, UserIcon, CheckIcon, XIcon, RefreshCcw } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface MovieDetailProps {
  id: string
}

export default function MovieDetail({ id }: MovieDetailProps) {
  const [movie, setMovie] = useState<any>(null)
  const [similar, setSimilar] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [country, setCountry] = useState("us")
  const [isAvailableOnNetflix, setIsAvailableOnNetflix] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const { toast } = useToast()

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
    async function fetchMovie() {
      try {
        setLoading(true)
        setError(null)

        // Get movie details
        const detailsResponse = await fetch(
          `/api/tmdb?endpoint=movie/${id}&append_to_response=credits,videos,watch/providers`,
        )

        if (!detailsResponse.ok) {
          throw new Error("Failed to fetch movie details")
        }

        const movieData = await detailsResponse.json()

        if (movieData.error) {
          throw new Error(movieData.error)
        }

        if (!movieData.id) {
          throw new Error("Movie not found")
        }

        setMovie(movieData)

        // Check if available on Netflix in selected country
        const watchProviders = movieData["watch/providers"]?.results?.[country]?.flatrate || []
        setIsAvailableOnNetflix(watchProviders.some((provider: any) => provider.provider_id === 8))

        // Get similar movies
        const similarResponse = await fetch(`/api/tmdb?endpoint=movie/${id}/similar`)

        if (similarResponse.ok) {
          const similarData = await similarResponse.json()
          setSimilar(similarData.results?.slice(0, 4) || [])
        }
      } catch (error: any) {
        console.error("Error fetching movie details:", error)
        setError(error.message)
        // Don't show toast for errors, just handle them gracefully
      } finally {
        setLoading(false)
      }
    }

    fetchMovie()
  }, [id, country, retryCount])

  const handleAddToWatchlist = () => {
    toast({
      title: "Added to watchlist",
      description: `${movie?.title} has been added to your watchlist.`,
    })
  }

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
  }

  if (loading) {
    return (
      <div className="pt-16">
        <div className="bg-card h-[50vh] relative">
          <Skeleton className="absolute inset-0" />
        </div>

        <div className="container px-4 -mt-32 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Skeleton className="aspect-[2/3] rounded-lg" />
            </div>
            <div className="md:col-span-2 space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-24" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="pt-24">
        <div className="container px-4 py-12">
          <Card>
            <CardContent className="pt-6 text-center">
              <h2 className="text-2xl font-bold mb-4">Movie Not Found</h2>
              <p className="text-muted-foreground mb-6">Sorry, we couldn't find the movie you're looking for.</p>
              <div className="flex justify-center gap-4">
                <Button onClick={() => window.history.back()}>Go Back</Button>
                <Button variant="outline" onClick={handleRetry}>
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Find trailer
  const trailer = movie.videos?.results?.find((video: any) => video.type === "Trailer" && video.site === "YouTube")

  // Get release year
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"

  // Get director
  const director = movie.credits?.crew?.find((person: any) => person.job === "Director")

  // Get top cast
  const topCast = movie.credits?.cast?.slice(0, 5) || []

  return (
    <div className="pt-16">
      {/* Backdrop */}
      <div className="relative h-[50vh] bg-black">
        {movie.backdrop_path && (
          <>
            <div className="absolute inset-0 opacity-30">
              <img
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          </>
        )}
      </div>

      {/* Movie Details */}
      <div className="container px-4 -mt-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Poster */}
          <div>
            <div className="rounded-lg overflow-hidden border shadow-xl">
              {movie.poster_path ? (
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="w-full" />
              ) : (
                <div className="aspect-[2/3] bg-muted flex items-center justify-center">
                  <span className="text-3xl font-bold text-muted-foreground">{movie.title.charAt(0)}</span>
                </div>
              )}
            </div>

            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={handleAddToWatchlist} className="w-full bg-netflix-red hover:bg-netflix-red/90">
                  Add to Watchlist
                </Button>
                {trailer && (
                  <a href={`https://www.youtube.com/watch?v=${trailer.key}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full gap-2">
                      <PlayCircleIcon className="h-4 w-4" />
                      Trailer
                    </Button>
                  </a>
                )}
              </div>

              <div className="py-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">IMDb Rating</span>
                  <div className="imdb-rating">{movie.vote_average?.toFixed(1)}/10</div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Runtime</span>
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 text-muted-foreground mr-1" />
                    <span className="font-medium">{movie.runtime} min</span>
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Released</span>
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground mr-1" />
                    <span className="font-medium">{releaseYear}</span>
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Netflix {country.toUpperCase()}</span>
                  <div className="flex items-center">
                    {isAvailableOnNetflix ? (
                      <>
                        <CheckIcon className="h-4 w-4 text-green-500 mr-1" />
                        <span className="font-medium text-green-500">Available</span>
                      </>
                    ) : (
                      <>
                        <XIcon className="h-4 w-4 text-netflix-red mr-1" />
                        <span className="font-medium text-netflix-red">Not Available</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{movie.title}</h1>
              {movie.tagline && <p className="text-muted-foreground italic">{movie.tagline}</p>}

              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {movie.genres.map((genre: any) => (
                    <Badge key={genre.id} variant="secondary">
                      {genre.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold mb-2">Overview</h2>
              <p className="text-muted-foreground">{movie.overview}</p>
            </div>

            {topCast.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-3">Cast</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {topCast.map((person: any) => (
                    <div key={person.id} className="text-center">
                      {person.profile_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                          alt={person.name}
                          className="w-full aspect-square object-cover rounded-full mb-2"
                        />
                      ) : (
                        <div className="w-full aspect-square bg-muted rounded-full flex items-center justify-center mb-2">
                          <UserIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <p className="font-medium text-sm">{person.name}</p>
                      <p className="text-xs text-muted-foreground">{person.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {director && (
              <div>
                <h2 className="text-xl font-bold mb-2">Director</h2>
                <p>{director.name}</p>
              </div>
            )}

            {similar.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-3">You Might Also Like</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {similar.map((movie) => (
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
                                <span className="text-xl font-bold text-muted-foreground">{movie.title.charAt(0)}</span>
                              </div>
                            )}
                          </div>
                          <div className="p-2">
                            <p className="font-medium text-sm truncate">{movie.title}</p>
                            <div className="imdb-rating text-xs mt-1">IMDb {movie.vote_average.toFixed(1)}</div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
