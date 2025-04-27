import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Play, Award } from "lucide-react"
import Image from "next/image"

interface Movie {
  id: number
  title: string
  description: string
  genre: string
  rating: number
  imdbRating: number
  year: number
  imageUrl: string
}

interface MovieCardProps {
  movie: Movie
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Card className="overflow-hidden bg-zinc-800 border-zinc-700 h-full flex flex-col">
      <div className="relative h-48 w-full bg-zinc-700">
        <div className="absolute inset-0 flex items-center justify-center text-zinc-500 text-sm">
          {movie.title} Poster
        </div>
        <Image
          src={movie.imageUrl || "/placeholder.svg"}
          alt={`${movie.title} poster`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          unoptimized
        />
      </div>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg line-clamp-1">{movie.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="bg-red-600/20 text-red-400 border-red-600/30">
                {movie.genre}
              </Badge>
              <span className="text-xs text-zinc-400">{movie.year}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 flex-grow">
        <p className="text-sm text-zinc-400 line-clamp-3 mb-2">{movie.description}</p>
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="ml-1 text-sm">{movie.rating}</span>
          </div>
          <div className="flex items-center">
            <Award className="h-4 w-4 text-blue-400" />
            <span className="ml-1 text-sm text-blue-400">IMDb: {movie.imdbRating}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full bg-red-600 hover:bg-red-700 gap-2">
          <Play className="h-4 w-4" /> Watch Now
        </Button>
      </CardFooter>
    </Card>
  )
}
