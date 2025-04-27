"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertTriangle, Brain, Film, Heart, Lightbulb, Users } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface ContentAnalysisProps {
  movieId: number
  title: string
  overview: string
  genres: string[]
}

interface AnalysisData {
  mood: string[]
  themes: string[]
  similarContent: string[]
  viewingContext: string[]
  contentWarnings: string[]
  analysis: string
}

export default function ContentAnalysis({ movieId, title, overview, genres }: ContentAnalysisProps) {
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null)

  const analyzeContent = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/analyze-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movieId,
          title,
          overview,
          genres,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze content")
      }

      const data = await response.json()
      setAnalysis(data.analysis)

      toast({
        title: "Analysis complete",
        description: "AI-powered content analysis is ready",
      })
    } catch (error) {
      console.error("Error analyzing content:", error)
      toast({
        title: "Error",
        description: "Failed to analyze content",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Content Analysis
        </CardTitle>
        <CardDescription>Get AI-powered insights about this content</CardDescription>
      </CardHeader>
      <CardContent>
        {!analysis && !loading ? (
          <div className="text-center py-6">
            <Lightbulb className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Discover deeper insights</h3>
            <p className="text-muted-foreground mb-4">
              Our AI can analyze this content to help you decide if it's right for you.
            </p>
            <Button onClick={analyzeContent}>Analyze Content</Button>
          </div>
        ) : loading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
            <div className="flex gap-2 mt-4">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        ) : (
          <Tabs defaultValue="overview">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="mood">Mood & Themes</TabsTrigger>
              <TabsTrigger value="similar">Similar Content</TabsTrigger>
              <TabsTrigger value="warnings">Warnings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <p className="text-sm">{analysis?.analysis}</p>

              <div>
                <h4 className="text-sm font-medium mb-2">Best Viewing Context</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis?.viewingContext.map((context, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {context}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="mood" className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Mood</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis?.mood.map((item, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Themes</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis?.themes.map((theme, index) => (
                    <Badge key={index} className="flex items-center gap-1">
                      <Lightbulb className="h-3 w-3" />
                      {theme}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="similar">
              <h4 className="text-sm font-medium mb-2">You Might Also Like</h4>
              <ul className="space-y-2">
                {analysis?.similarContent.map((title, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Film className="h-4 w-4 text-muted-foreground" />
                    {title}
                  </li>
                ))}
              </ul>
            </TabsContent>

            <TabsContent value="warnings">
              <h4 className="text-sm font-medium mb-2">Content Warnings</h4>
              {analysis?.contentWarnings.length === 0 ? (
                <p className="text-sm text-muted-foreground">No significant content warnings for this title.</p>
              ) : (
                <ul className="space-y-2">
                  {analysis?.contentWarnings.map((warning, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      {warning}
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}
