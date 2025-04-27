import MovieDetail from "@/components/movie-detail"
import Layout from "@/components/netflix-layout"

export default function MovieDetailPage({ params }: { params: { id: string } }) {
  return (
    <Layout>
      <MovieDetail id={params.id} />
    </Layout>
  )
}
