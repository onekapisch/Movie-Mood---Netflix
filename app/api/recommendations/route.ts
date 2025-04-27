import { NextResponse } from "next/server"
import { kv } from "@vercel/kv"

// Sample algorithm weights - in production you'd tune these based on user data
const WEIGHTS = {
  genre: 0.4,
  director: 0.2,
  actor: 0.2,
  releaseYear: 0.1,
  userRating: 0.3,
  popularity: 0.2,
  watchHistory: 0.5,
  timeOfDay: 0.1,
  weekday: 0.1,
  contentLength: 0.2,
}

export async function POST(request: Request) {
  try {
    const { userId, preferences, watchHistory, currentMood, timeAvailable } = await request.json()

    // Fetch user data from KV store
    const userData = await kv.get(`user:${userId}`)

    // Get time context
    const now = new Date()
    const hour = now.getHours()
    const weekday = now.getDay()

    // Fetch content catalog (in production, this would be from a database)
    const catalog = await kv.get("netflix:catalog")

    if (!catalog) {
      return NextResponse.json({ error: "Content catalog not available" }, { status: 500 })
    }

    // Apply multi-factor recommendation algorithm
    const recommendations = catalog.map((content: any) => {
      let score = 0

      // Genre match
      if (preferences.genres.some((g: string) => content.genres.includes(g))) {
        score += WEIGHTS.genre
      }

      // Director match
      if (preferences.directors.includes(content.director)) {
        score += WEIGHTS.director
      }

      // Actor match
      if (content.cast.some((actor: string) => preferences.actors.includes(actor))) {
        score += WEIGHTS.actor
      }

      // Content length appropriate for available time
      if (timeAvailable && content.runtime <= timeAvailable) {
        score += WEIGHTS.contentLength
      }

      // Mood matching
      if (currentMood === "happy" && (content.genres.includes("comedy") || content.genres.includes("family"))) {
        score += 0.3
      } else if (
        currentMood === "thoughtful" &&
        (content.genres.includes("drama") || content.genres.includes("documentary"))
      ) {
        score += 0.3
      }

      // Time of day context
      if ((hour >= 20 || hour <= 2) && content.genres.includes("horror")) {
        score += WEIGHTS.timeOfDay // Horror movies score higher at night
      }

      // Weekend vs weekday
      if ((weekday === 0 || weekday === 6) && content.runtime > 120) {
        score += WEIGHTS.weekday // Longer movies score higher on weekends
      }

      // Avoid recently watched content
      if (watchHistory.includes(content.id)) {
        score -= 0.5
      }

      return {
        ...content,
        score,
      }
    })

    // Sort by score and return top recommendations
    const topRecommendations = recommendations.sort((a: any, b: any) => b.score - a.score).slice(0, 10)

    return NextResponse.json({ recommendations: topRecommendations })
  } catch (error) {
    console.error("Recommendation error:", error)
    return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 })
  }
}
