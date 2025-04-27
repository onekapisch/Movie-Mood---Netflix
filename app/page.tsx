"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import MovieCard from "@/components/movie-card"
import { movies } from "@/lib/movie-data"

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "👋 Hi there! Looking for something to watch on Netflix today? What genre are you in the mood for?",
    },
  ])
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)
  const [showRecommendations, setShowRecommendations] = useState(false)

  // Expanded list of Netflix genres
  const genres = [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "Horror",
    "Music",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Thriller",
    "War",
    "Western",
  ]

  const handleGenreSelect = (genre: string) => {
    setSelectedGenre(genre)
    setMessages([
      ...messages,
      { role: "user", content: `I feel like watching ${genre}` },
      {
        role: "assistant",
        content: `Great choice! Here are my top 10 ${genre} recommendations on Netflix right now:`,
      },
    ])
    setShowRecommendations(true)
  }

  const handleReset = () => {
    setMessages([
      {
        role: "assistant",
        content: "Want to explore another genre? What are you in the mood for now?",
      },
    ])
    setSelectedGenre(null)
    setShowRecommendations(false)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24 bg-black text-white">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-red-600 mb-8 text-center">Netflix Picker by Kapisch</h1>

        <Card className="w-full bg-zinc-900 border-zinc-800 text-white">
          <CardHeader>
            <CardTitle className="text-xl text-red-600">What Should I Watch Tonight?</CardTitle>
            <CardDescription className="text-zinc-400">
              Get personalized Netflix recommendations based on your mood
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}>
                    {message.role === "assistant" && (
                      <Avatar className="h-8 w-8 mr-2 bg-red-600">
                        <span className="text-xs">NP</span>
                      </Avatar>
                    )}
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        message.role === "assistant" ? "bg-zinc-800" : "bg-red-600"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {!selectedGenre && (
              <div className="mt-6">
                <h3 className="mb-3 text-zinc-400">Select a genre:</h3>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <Button
                      key={genre}
                      className="bg-zinc-800 text-white hover:bg-red-600 hover:text-white border-none"
                      onClick={() => handleGenreSelect(genre)}
                    >
                      {genre}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {showRecommendations && (
              <div className="mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {movies
                    .filter((movie) => movie.genre === selectedGenre)
                    .slice(0, 10)
                    .map((movie) => (
                      <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>

                <Button className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white" onClick={handleReset}>
                  Try Another Genre
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
