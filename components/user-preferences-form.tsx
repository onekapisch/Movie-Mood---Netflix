"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"

const genreOptions = [
  { id: "action", label: "Action" },
  { id: "comedy", label: "Comedy" },
  { id: "drama", label: "Drama" },
  { id: "horror", label: "Horror" },
  { id: "romance", label: "Romance" },
  { id: "sci-fi", label: "Sci-Fi" },
  { id: "thriller", label: "Thriller" },
  { id: "documentary", label: "Documentary" },
  { id: "animation", label: "Animation" },
  { id: "fantasy", label: "Fantasy" },
]

const formSchema = z.object({
  favoriteGenres: z.array(z.string()).min(1, {
    message: "Please select at least one genre.",
  }),
  contentLength: z.object({
    min: z.number().min(30),
    max: z.number().max(240),
  }),
  releaseYearRange: z.object({
    start: z.number().min(1900).max(2023),
    end: z.number().min(1900).max(2023),
  }),
  preferredLanguages: z.array(z.string()),
  maturityRating: z.array(z.string()),
  favoriteActors: z.array(z.string()),
  favoriteDirectors: z.array(z.string()),
  excludeWatched: z.boolean(),
  moodBasedRecommendations: z.boolean(),
  currentMood: z.string().optional(),
  timeAvailable: z.number().optional(),
})

export default function UserPreferencesForm() {
  const [showMoodSelector, setShowMoodSelector] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      favoriteGenres: ["comedy", "action"],
      contentLength: { min: 60, max: 150 },
      releaseYearRange: { start: 2000, end: 2023 },
      preferredLanguages: ["english"],
      maturityRating: ["PG-13", "R"],
      favoriteActors: [],
      favoriteDirectors: [],
      excludeWatched: true,
      moodBasedRecommendations: false,
      timeAvailable: 120,
    },
  })

  useEffect(() => {
    // Load saved preferences from localStorage
    const savedPreferences = localStorage.getItem("netflix-picker-preferences")
    if (savedPreferences) {
      form.reset(JSON.parse(savedPreferences))
    }
  }, [form])

  useEffect(() => {
    const moodBased = form.watch("moodBasedRecommendations")
    setShowMoodSelector(moodBased)
  }, [form.watch("moodBasedRecommendations")])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Save to localStorage
      localStorage.setItem("netflix-picker-preferences", JSON.stringify(values))

      // Save to backend
      const response = await fetch("/api/user/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to save preferences")
      }

      toast({
        title: "Preferences saved",
        description: "Your viewing preferences have been updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="favoriteGenres"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Favorite Genres</FormLabel>
              <FormDescription>Select the genres you enjoy watching the most.</FormDescription>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {genreOptions.map((genre) => (
                  <FormItem key={genre.id} className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(genre.id)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...field.value, genre.id])
                            : field.onChange(field.value?.filter((value) => value !== genre.id))
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">{genre.label}</FormLabel>
                  </FormItem>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contentLength"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content Length (minutes)</FormLabel>
              <FormDescription>Select your preferred movie/show length range.</FormDescription>
              <div className="pt-6">
                <Slider
                  min={30}
                  max={240}
                  step={10}
                  value={[field.value.min, field.value.max]}
                  onValueChange={([min, max]) => {
                    field.onChange({ min, max })
                  }}
                />
                <div className="flex justify-between mt-2">
                  <span>{field.value.min} min</span>
                  <span>{field.value.max} min</span>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="excludeWatched"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Exclude Watched Content</FormLabel>
                  <FormDescription>Don't recommend content you've already watched.</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="moodBasedRecommendations"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Mood-Based Recommendations</FormLabel>
                  <FormDescription>Get recommendations based on your current mood.</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {showMoodSelector && (
          <FormField
            control={form.control}
            name="currentMood"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Mood</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your current mood" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="happy">Happy</SelectItem>
                    <SelectItem value="sad">Sad</SelectItem>
                    <SelectItem value="excited">Excited</SelectItem>
                    <SelectItem value="relaxed">Relaxed</SelectItem>
                    <SelectItem value="thoughtful">Thoughtful</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="timeAvailable"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time Available (minutes)</FormLabel>
              <FormDescription>How much time do you have for watching?</FormDescription>
              <FormControl>
                <Input
                  type="number"
                  min={15}
                  max={300}
                  onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Save Preferences</Button>
      </form>
    </Form>
  )
}
