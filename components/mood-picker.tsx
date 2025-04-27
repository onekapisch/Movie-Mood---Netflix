"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Heart, Smile, Frown, PartyPopper, Coffee, Moon, Zap, Clock } from "lucide-react"

interface MoodOption {
  id: string
  label: string
  icon: React.ElementType
  description: string
  color: string
}

const moodOptions: MoodOption[] = [
  {
    id: "happy",
    label: "Happy",
    icon: Smile,
    description: "Uplifting, feel-good content",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  {
    id: "sad",
    label: "Sad",
    icon: Frown,
    description: "Emotional, moving stories",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  {
    id: "excited",
    label: "Excited",
    icon: PartyPopper,
    description: "Action-packed, thrilling content",
    color: "bg-red-100 text-red-700 border-red-200",
  },
  {
    id: "relaxed",
    label: "Relaxed",
    icon: Coffee,
    description: "Calm, easy-going viewing",
    color: "bg-green-100 text-green-700 border-green-200",
  },
  {
    id: "thoughtful",
    label: "Thoughtful",
    icon: Moon,
    description: "Thought-provoking, deep content",
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
  {
    id: "energetic",
    label: "Energetic",
    icon: Zap,
    description: "Fast-paced, engaging content",
    color: "bg-orange-100 text-orange-700 border-orange-200",
  },
]

interface EnergyOption {
  id: string
  label: string
  description: string
}

const energyOptions: EnergyOption[] = [
  { id: "low", label: "Low Energy", description: "Slow-paced, relaxing content" },
  { id: "medium", label: "Medium Energy", description: "Balanced pacing and engagement" },
  { id: "high", label: "High Energy", description: "Fast-paced, intense content" },
]

interface MoodPickerProps {
  onMoodSelect?: (mood: string, energy: string, contentLength: number) => void
}

export default function MoodPicker({ onMoodSelect }: MoodPickerProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [selectedEnergy, setSelectedEnergy] = useState<string>("medium")
  const [contentLength, setContentLength] = useState<number>(120)
  const [activeTab, setActiveTab] = useState("mood")
  const { toast } = useToast()

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId)
    setActiveTab("energy")
  }

  const handleEnergySelect = (energyId: string) => {
    setSelectedEnergy(energyId)
    setActiveTab("length")
  }

  const handleSubmit = () => {
    if (!selectedMood) {
      toast({
        title: "Please select a mood",
        description: "Select your current mood to get recommendations",
        variant: "destructive",
      })
      return
    }

    if (typeof onMoodSelect === "function") {
      onMoodSelect(selectedMood, selectedEnergy, contentLength)
    } else {
      console.log("Mood selection:", { mood: selectedMood, energy: selectedEnergy, length: contentLength })
    }

    toast({
      title: "Preferences saved",
      description: "Finding content that matches your mood...",
    })
  }

  return (
    <Card className="netflix-card border-0">
      <CardHeader className="border-b border-netflix-gray/20">
        <CardTitle className="flex items-center gap-2 text-netflix-light">
          <Heart className="h-5 w-5 text-netflix-red" />
          How are you feeling today?
        </CardTitle>
        <CardDescription className="text-netflix-gray">
          Let us recommend content based on your current mood
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4 bg-netflix-dark">
            <TabsTrigger value="mood" className="data-[state=active]:bg-netflix-red">
              Mood
            </TabsTrigger>
            <TabsTrigger value="energy" className="data-[state=active]:bg-netflix-red">
              Energy Level
            </TabsTrigger>
            <TabsTrigger value="length" className="data-[state=active]:bg-netflix-red">
              Content Length
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mood" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {moodOptions.map((mood) => (
                <div
                  key={mood.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedMood === mood.id
                      ? `border-netflix-red bg-netflix-dark/80`
                      : "border-netflix-gray/20 hover:border-netflix-gray/50"
                  }`}
                  onClick={() => handleMoodSelect(mood.id)}
                >
                  <div className="flex flex-col items-center text-center gap-2">
                    <mood.icon className={`h-8 w-8 ${selectedMood === mood.id ? "text-netflix-red" : ""}`} />
                    <h3 className="font-medium text-netflix-light">{mood.label}</h3>
                    <p className="text-xs text-netflix-gray">{mood.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <Button className="netflix-button" onClick={() => setActiveTab("energy")} disabled={!selectedMood}>
                Next
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="energy" className="space-y-4">
            <div className="space-y-4">
              {energyOptions.map((energy) => (
                <div
                  key={energy.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedEnergy === energy.id
                      ? "border-netflix-red bg-netflix-dark/80"
                      : "border-netflix-gray/20 hover:border-netflix-gray/50"
                  }`}
                  onClick={() => handleEnergySelect(energy.id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-netflix-light">{energy.label}</h3>
                      <p className="text-sm text-netflix-gray">{energy.description}</p>
                    </div>
                    <div className="w-16 bg-netflix-gray/30 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          energy.id === "low"
                            ? "w-1/3 bg-netflix-red"
                            : energy.id === "medium"
                              ? "w-2/3 bg-netflix-red"
                              : "w-full bg-netflix-red"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setActiveTab("mood")}>
                Back
              </Button>
              <Button className="netflix-button" onClick={() => setActiveTab("length")}>
                Next
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="length" className="space-y-4">
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-netflix-light mb-2">Content Length: {contentLength} minutes</h3>
                <p className="text-sm text-netflix-gray mb-4">How much time do you have available?</p>
                <Slider
                  min={30}
                  max={240}
                  step={15}
                  value={[contentLength]}
                  onValueChange={(value) => setContentLength(value[0])}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-netflix-gray mt-2">
                  <span>30 min</span>
                  <span>1 hour</span>
                  <span>2 hours</span>
                  <span>4 hours</span>
                </div>
              </div>

              <div className="bg-netflix-dark/50 p-4 rounded-lg border border-netflix-gray/20">
                <h3 className="font-medium text-netflix-light mb-2">Your Selection</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedMood && (
                    <Badge variant="outline" className="bg-netflix-dark border-netflix-gray/30 text-netflix-light">
                      <Heart className="h-3 w-3 mr-1 text-netflix-red" />
                      Mood: {moodOptions.find((m) => m.id === selectedMood)?.label}
                    </Badge>
                  )}
                  <Badge variant="outline" className="bg-netflix-dark border-netflix-gray/30 text-netflix-light">
                    <Zap className="h-3 w-3 mr-1 text-netflix-red" />
                    Energy: {energyOptions.find((e) => e.id === selectedEnergy)?.label}
                  </Badge>
                  <Badge variant="outline" className="bg-netflix-dark border-netflix-gray/30 text-netflix-light">
                    <Clock className="h-3 w-3 mr-1 text-netflix-red" />
                    Length: {contentLength} minutes
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setActiveTab("energy")}>
                Back
              </Button>
              <Button className="netflix-button" onClick={handleSubmit}>
                Find Content
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
