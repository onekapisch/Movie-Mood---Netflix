import { HeartIcon, SearchIcon, FilmIcon } from "lucide-react"

export default function HowItWorks() {
  return (
    <section className="py-16">
      <div className="container px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">How MovieMood Works</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <HeartIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Tell us your mood</h3>
            <p className="text-muted-foreground">
              Whether you're feeling happy, sad, thoughtful, or energetic, we'll find content that matches your current
              state of mind.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <SearchIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Add preferences</h3>
            <p className="text-muted-foreground">
              Specify content length, genres you enjoy, and energy level to fine-tune your recommendations.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FilmIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Get perfect matches</h3>
            <p className="text-muted-foreground">
              Receive personalized movie and TV show recommendations that are perfect for your current mood and
              preferences.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
