import type { Metadata } from "next"
import DiscoverPageClient from "./DiscoverPageClient"

export const metadata: Metadata = {
  title: "Discover Movies - MovieMood",
  description: "Browse and discover movies by genre, popularity, and more.",
}

export default function DiscoverPage() {
  return <DiscoverPageClient />
}
