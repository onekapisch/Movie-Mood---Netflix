import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const endpoint = searchParams.get("endpoint")
  const query = searchParams.get("query")

  const TMDB_API_KEY = process.env.TMDB_API_KEY
  const TMDB_BASE_URL = "https://api.themoviedb.org/3"

  if (!TMDB_API_KEY) {
    console.error("TMDB API key not configured")
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }

  if (!endpoint) {
    return NextResponse.json({ error: "Missing endpoint parameter" }, { status: 400 })
  }

  try {
    let url = `${TMDB_BASE_URL}/${endpoint}?api_key=${TMDB_API_KEY}`

    if (query) {
      url += `&query=${encodeURIComponent(query)}`
    }

    // Add additional parameters from the request
    searchParams.forEach((value, key) => {
      if (key !== "endpoint" && key !== "query") {
        url += `&${key}=${encodeURIComponent(value)}`
      }
    })

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("TMDB API error:", error)
    return NextResponse.json(
      {
        results: [],
        status_message: "Could not fetch data at this time. Please try again later.",
      },
      { status: 200 },
    ) // Return empty results instead of error
  }
}
