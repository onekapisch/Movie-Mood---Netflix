"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, Film, MoreHorizontal, Plus, Trash2, Users, X } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import MovieDetails from "./movie-details"

interface WatchlistItem {
  id: number
  tmdbId: number
  title: string
  posterPath: string
  addedAt: string
  priority: "low" | "medium" | "high"
  tags: string[]
  watchWith?: string[]
}

export default function SmartWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMovie, setSelectedMovie] = useState<number | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [editingTags, setEditingTags] = useState<{ [key: number]: boolean }>({})
  const [newTag, setNewTag] = useState<{ [key: number]: string }>({})

  useEffect(() => {
    fetchWatchlist()
  }, [])

  const fetchWatchlist = async () => {
    setLoading(true)
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll use mock data
      const mockWatchlist: WatchlistItem[] = [
        {
          id: 1,
          tmdbId: 550,
          title: "Fight Club",
          posterPath: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
          addedAt: "2023-04-15T12:00:00Z",
          priority: "high",
          tags: ["thriller", "must-watch"],
          watchWith: ["Alex", "Jordan"],
        },
        {
          id: 2,
          tmdbId: 278,
          title: "The Shawshank Redemption",
          posterPath: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
          addedAt: "2023-04-10T14:30:00Z",
          priority: "medium",
          tags: ["classic", "drama"],
        },
        {
          id: 3,
          tmdbId: 238,
          title: "The Godfather",
          posterPath: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
          addedAt: "2023-04-05T09:15:00Z",
          priority: "low",
          tags: ["classic", "crime"],
        },
        {
          id: 4,
          tmdbId: 424,
          title: "Schindler's List",
          posterPath: "/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
          addedAt: "2023-03-28T18:45:00Z",
          priority: "medium",
          tags: ["historical", "drama"],
        },
        {
          id: 5,
          tmdbId: 13,
          title: "Forrest Gump",
          posterPath: "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
          addedAt: "2023-03-20T11:20:00Z",
          priority: "high",
          tags: ["feel-good", "comedy-drama"],
          watchWith: ["Taylor"],
        },
      ]

      setWatchlist(mockWatchlist)
    } catch (error) {
      console.error("Error fetching watchlist:", error)
      toast({
        title: "Error",
        description: "Failed to load your watchlist",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const removeFromWatchlist = async (id: number) => {
    try {
      // In a real app, this would be an API call
      setWatchlist(watchlist.filter((item) => item.id !== id))

      toast({
        title: "Removed from watchlist",
        description: "The movie has been removed from your watchlist",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove from watchlist",
        variant: "destructive",
      })
    }
  }

  const updatePriority = async (id: number, priority: "low" | "medium" | "high") => {
    try {
      // In a real app, this would be an API call
      setWatchlist(watchlist.map((item) => (item.id === id ? { ...item, priority } : item)))

      toast({
        title: "Priority updated",
        description: `Priority set to ${priority}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update priority",
        variant: "destructive",
      })
    }
  }

  const addTag = (id: number) => {
    if (!newTag[id] || newTag[id].trim() === "") return

    try {
      const updatedWatchlist = watchlist.map((item) => {
        if (item.id === id) {
          const tags = [...item.tags]
          if (!tags.includes(newTag[id])) {
            tags.push(newTag[id])
          }
          return { ...item, tags }
        }
        return item
      })

      setWatchlist(updatedWatchlist)
      setNewTag({ ...newTag, [id]: "" })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add tag",
        variant: "destructive",
      })
    }
  }

  const removeTag = (id: number, tag: string) => {
    try {
      const updatedWatchlist = watchlist.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            tags: item.tags.filter((t) => t !== tag),
          }
        }
        return item
      })

      setWatchlist(updatedWatchlist)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove tag",
        variant: "destructive",
      })
    }
  }

  const filteredWatchlist = watchlist.filter((item) => {
    if (activeTab === "all") return true
    if (activeTab === "high") return item.priority === "high"
    if (activeTab === "medium") return item.priority === "medium"
    if (activeTab === "low") return item.priority === "low"
    if (activeTab === "with-friends") return item.watchWith && item.watchWith.length > 0
    return true
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-green-500"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Watchlist</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Movie
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="high">High Priority</TabsTrigger>
          <TabsTrigger value="medium">Medium Priority</TabsTrigger>
          <TabsTrigger value="low">Low Priority</TabsTrigger>
          <TabsTrigger value="with-friends">Watch with Friends</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-[200px] w-full" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredWatchlist.length === 0 ? (
            <div className="text-center py-12">
              <Film className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No movies in this category</h3>
              <p className="text-muted-foreground">Add some movies to your watchlist to see them here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredWatchlist.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="relative">
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedMovie(item.tmdbId)
                        setDetailsOpen(true)
                      }}
                    >
                      {item.posterPath ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w500${item.posterPath}`}
                          alt={item.title}
                          className="w-full h-[200px] object-cover"
                        />
                      ) : (
                        <div className="w-full h-[200px] bg-muted flex items-center justify-center">
                          <Film className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="absolute top-2 right-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="bg-black/50 text-white hover:bg-black/70">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Options</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => updatePriority(item.id, "high")}
                            className={item.priority === "high" ? "bg-muted" : ""}
                          >
                            <span className="text-red-500 mr-2">●</span> High Priority
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => updatePriority(item.id, "medium")}
                            className={item.priority === "medium" ? "bg-muted" : ""}
                          >
                            <span className="text-yellow-500 mr-2">●</span> Medium Priority
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => updatePriority(item.id, "low")}
                            className={item.priority === "low" ? "bg-muted" : ""}
                          >
                            <span className="text-green-500 mr-2">●</span> Low Priority
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setEditingTags({ ...editingTags, [item.id]: !editingTags[item.id] })}
                          >
                            Edit Tags
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => removeFromWatchlist(item.id)} className="text-red-500">
                            <Trash2 className="mr-2 h-4 w-4" /> Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <span className={`text-sm font-medium ${getPriorityColor(item.priority)}`}>
                        ● {item.priority}
                      </span>
                    </div>
                    <CardDescription className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Added {new Date(item.addedAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pb-2">
                    {item.watchWith && item.watchWith.length > 0 && (
                      <div className="flex items-center gap-1 mb-2 text-sm">
                        <Users className="h-3 w-3" />
                        <span>Watch with: {item.watchWith.join(", ")}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                          {editingTags[item.id] && (
                            <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => removeTag(item.id, tag)} />
                          )}
                        </Badge>
                      ))}
                    </div>

                    {editingTags[item.id] && (
                      <div className="mt-2 flex gap-2">
                        <input
                          type="text"
                          value={newTag[item.id] || ""}
                          onChange={(e) => setNewTag({ ...newTag, [item.id]: e.target.value })}
                          placeholder="Add tag"
                          className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              addTag(item.id)
                            }
                          }}
                        />
                        <Button size="sm" onClick={() => addTag(item.id)}>
                          Add
                        </Button>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setSelectedMovie(item.tmdbId)
                        setDetailsOpen(true)
                      }}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {selectedMovie && <MovieDetails movieId={selectedMovie} isOpen={detailsOpen} onOpenChange={setDetailsOpen} />}
    </div>
  )
}
