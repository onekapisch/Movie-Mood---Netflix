"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Star, Calendar, Clock, Film, ThumbsUp, ThumbsDown, Share2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface MovieDetailsProps {
  movieId: number
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export default function MovieDetails({ movieId, isOpen, onOpenChange }: MovieDetailsProps) {
  const [movie, setMovie] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [trailerKey, setTrailerKey] = useState<string | null>(null)
  const [similarMovies, setSimilarMovies] = useState<any[]>([])

  useEffect(() => {
    if (isOpen && movieId) {
      fetchMovieDetails()
    }
  }, [isOpen, movieId])

  const fetchMovieDetails = async () => {
    setLoading(true)
    try {
      // Fetch movie details
      const detailsResponse = await fetch(
        `/api/tmdb?endpoint=movie/${movieId}&append_to_response=credits,videos,similar`,
      )
      const data = await detailsResponse.json()
      setMovie(data)

      // Extract trailer
      const trailer = data.videos?.results?.find((video: any) => video.type === "Trailer" && video.site === "YouTube")
      setTrailerKey(trailer?.key || null)

      // Extract similar movies
      setSimilarMovies(data.similar?.results?.slice(0, 4) || [])
    } catch (error) {
      console.error("Error fetching movie details:", error)
      toast({
        title: "Error",
        description: "Failed to load movie details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddToWatchlist = async () => {
    try {
      await fetch("/api/watchlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movieId,
          title: movie.title,
          posterPath: movie.poster_path,
        }),
      })

      toast({
        title: "Added to watchlist",
        description: `${movie.title} has been added to your watchlist`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add to watchlist",
        variant: "destructive",
      })
    }
  }

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-[400px] w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-20" />
            </div>
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">{movie?.title}</DialogTitle>
              <DialogDescription className="flex flex-wrap gap-2 items-center">
                {movie?.release_date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(movie.release_date).getFullYear()}
                  </span>
                )}
                {movie?.runtime > 0 && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatRuntime(movie.runtime)}
                  </span>
                )}
                {movie?.vote_average > 0 && (
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400" />
                    {movie.vote_average.toFixed(1)}/10
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                {movie?.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full rounded-md shadow-md"
                  />
                ) : (
                  <div className="w-full aspect-[2/3] bg-muted rounded-md flex items-center justify-center">
                    <Film className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}

                <div className="mt-4 flex flex-col gap-2">
                  <Button onClick={handleAddToWatchlist}>Add to Watchlist</Button>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                {trailerKey && (
                  <div className="aspect-video w-full">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${trailerKey}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-medium">Overview</h3>
                  <p className="mt-2 text-muted-foreground">{movie?.overview}</p>
                </div>

                {movie?.genres && movie.genres.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium">Genres</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {movie.genres.map((genre: any) => (
                        <Badge key={genre.id} variant="outline">
                          {genre.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {movie?.credits?.cast && movie.credits.cast.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium">Cast</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                      {movie.credits.cast.slice(0, 6).map((person: any) => (
                        <div key={person.id} className="flex items-center gap-2">
                          {person.profile_path ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w45${person.profile_path}`}
                              alt={person.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                              <span className="text-xs">{person.name.charAt(0)}</span>
                            </div>
                          )}
                          <div className="text-sm">
                            <p className="font-medium">{person.name}</p>
                            <p className="text-xs text-muted-foreground">{person.character}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {similarMovies.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium">Similar Movies</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                      {similarMovies.map((similar) => (
                        <div key={similar.id} className="cursor-pointer">
                          {similar.poster_path ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w185${similar.poster_path}`}
                              alt={similar.title}
                              className="w-full rounded-md"
                            />
                          ) : (
                            <div className="w-full aspect-[2/3] bg-muted rounded-md flex items-center justify-center">
                              <Film className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                          <p className="text-xs mt-1 truncate">{similar.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
