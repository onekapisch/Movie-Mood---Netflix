import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: Request) {
  try {
    const { movieId, title, overview, genres } = await request.json()

    if (!title || !overview) {
      return NextResponse.json({ error: "Missing required movie information" }, { status: 400 })
    }

    // Construct the prompt for the AI
    const prompt = `
      Analyze the following movie/show and provide insights:
      
      Title: ${title}
      Overview: ${overview}
      Genres: ${genres.join(", ")}
      
      Please provide the following analysis:
      1. Mood: What mood does this content evoke? (e.g., uplifting, tense, melancholic)
      2. Themes: What are the main themes explored?
      3. Similar Content: What other movies/shows might someone enjoy if they like this?
      4. Viewing Context: When would be the best time to watch this? (e.g., date night, family movie night, solo viewing)
      5. Content Warnings: Are there any elements viewers should be aware of? (violence, emotional intensity, etc.)
      
      Format your response as JSON with the following structure:
      {
        "mood": ["primary mood", "secondary mood"],
        "themes": ["theme1", "theme2", "theme3"],
        "similarContent": ["title1", "title2", "title3"],
        "viewingContext": ["context1", "context2"],
        "contentWarnings": ["warning1", "warning2"],
        "analysis": "A paragraph with deeper insights about the content"
      }
    `

    // Generate analysis using AI
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      temperature: 0.7,
      maxTokens: 1000,
    })

    // Parse the JSON response
    let analysis
    try {
      analysis = JSON.parse(text)
    } catch (error) {
      console.error("Error parsing AI response:", error)
      return NextResponse.json({ error: "Failed to parse AI analysis" }, { status: 500 })
    }

    // Store the analysis in the database for future use
    // This would be implemented in a real application

    return NextResponse.json({
      movieId,
      title,
      analysis,
    })
  } catch (error) {
    console.error("Content analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze content" }, { status: 500 })
  }
}
