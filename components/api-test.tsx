"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"

export default function ApiTest() {
  const [query, setQuery] = useState("Stranger Things")
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testApi = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/tmdb?endpoint=search/multi&query=${encodeURIComponent(query)}`)

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setResults(data.results || [])

      toast({
        title: "API Test Successful",
        description: `Found ${data.results?.length || 0} results`,
      })
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "API Test Failed",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>TMDB API Test</CardTitle>
        <CardDescription>Test your TMDB API integration</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter a movie or TV show title"
            className="flex-1"
          />
          <Button onClick={testApi} disabled={loading}>
            {loading ? "Testing..." : "Test API"}
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-md">
            <h3 className="font-medium">Error:</h3>
            <p>{error}</p>
            <p className="mt-2 text-sm">Make sure your TMDB_API_KEY environment variable is set correctly.</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium">Results:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {results.slice(0, 4).map((item) => (
                <div key={item.id} className="border rounded-md p-3">
                  <div className="font-medium">{item.title || item.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {item.media_type.charAt(0).toUpperCase() + item.media_type.slice(1)} •
                    {item.release_date || item.first_air_date || "N/A"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        This component tests if your TMDB API key is working correctly.
      </CardFooter>
    </Card>
  )
}
