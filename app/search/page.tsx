"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import NetflixLayout from "@/components/netflix-layout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchIcon } from "lucide-react"
import ContentCard from "@/components/content-card"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [query, setQuery] = useState(initialQuery)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery)
    }
  }, [initialQuery])

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/tmdb?endpoint=search/multi&query=${encodeURIComponent(searchQuery)}`)

      if (!response.ok) {
        throw new Error(`Search failed with status ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      // Filter out people and only keep movies and TV shows
      const filteredResults = (data.results || []).filter(
        (item: any) => item.media_type === "movie" || item.media_type === "tv",
      )

      setSearchResults(filteredResults)
    } catch (err: any) {
      console.error("Search error:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(query)

    // Update URL with search query
    const url = new URL(window.location.href)
    url.searchParams.set("q", query)
    window.history.pushState({}, "", url.toString())
  }

  return (
    <NetflixLayout>
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6 netflix-title">Search</h1>

          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-netflix-gray" />
                <Input
                  type="text"
                  placeholder="Search for movies, TV shows..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10 bg-netflix-dark border-netflix-gray/30 focus:border-netflix-red"
                />
              </div>
              <Button type="submit" className="netflix-button">
                Search
              </Button>
            </div>
          </form>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="p-6 bg-netflix-dark rounded-lg">
              <h2 className="text-xl font-bold text-netflix-red mb-2">Search Error</h2>
              <p className="text-netflix-light">{error}</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div>
              <h2 className="text-xl font-bold mb-4 netflix-title">Search Results</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {searchResults.map((item) => (
                  <ContentCard
                    key={item.id}
                    id={item.id}
                    title={item.title || item.name}
                    posterPath={item.poster_path}
                    mediaType={item.media_type}
                  />
                ))}
              </div>
            </div>
          ) : initialQuery ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-bold mb-2 netflix-title">No results found</h2>
              <p className="text-netflix-gray">
                We couldn't find any matches for "{initialQuery}". Please try another search.
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-bold mb-2 netflix-title">Discover something new</h2>
              <p className="text-netflix-gray">Search for movies, TV shows, and more to find your next favorite.</p>
            </div>
          )}
        </div>
      </div>
    </NetflixLayout>
  )
}
