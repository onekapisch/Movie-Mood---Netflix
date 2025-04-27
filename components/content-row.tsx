"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import ContentCard from "./content-card"

interface ContentRowProps {
  title: string
  endpoint: string
}

export default function ContentRow({ title, endpoint }: ContentRowProps) {
  const [content, setContent] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [scrollPosition, setScrollPosition] = useState(0)
  const rowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchContent() {
      try {
        const response = await fetch(`/api/tmdb?endpoint=${endpoint}`)

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`)
        }

        const data = await response.json()

        if (data.error) {
          throw new Error(data.error)
        }

        setContent(data.results || [])
      } catch (err: any) {
        console.error(`Error fetching ${endpoint}:`, err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [endpoint])

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth

      rowRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      })

      setScrollPosition(scrollTo)
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <h2 className="text-xl font-bold netflix-title">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-netflix-dark rounded-md animate-pulse"></div>
            ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-3">
        <h2 className="text-xl font-bold netflix-title">{title}</h2>
        <div className="p-4 bg-netflix-dark rounded-md">
          <p className="text-netflix-red">Error loading content: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold netflix-title">{title}</h2>

      <div className="relative group">
        {/* Left Navigation */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>

        {/* Content Row */}
        <div
          ref={rowRef}
          className="flex overflow-x-auto space-x-4 scrollbar-hide pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {content.map((item) => (
            <ContentCard
              key={item.id}
              id={item.id}
              title={item.title || item.name}
              posterPath={item.poster_path}
              mediaType={item.media_type || (item.first_air_date ? "tv" : "movie")}
            />
          ))}
        </div>

        {/* Right Navigation */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      </div>
    </div>
  )
}
