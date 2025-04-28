import type { Metadata } from "next"
import MovieDetail from "@/components/movie-detail"
import Layout from "@/components/netflix-layout"

// Dynamic metadata for movie pages
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  // Fetch movie data
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${params.id}?api_key=${process.env.TMDB_API_KEY}`)
    const movie = await response.json()

    return {
      title: `${movie.title} - MovieMood`,
      description: movie.overview || "View movie details on MovieMood",
    }
  } catch (error) {
    return {
      title: "Movie Details - MovieMood",
      description: "View movie details on MovieMood",
    }
  }
}

export default function MovieDetailPage({ params }: { params: { id: string } }) {
  return (
    <Layout>
      <MovieDetail id={params.id} />
    </Layout>
  )
}
