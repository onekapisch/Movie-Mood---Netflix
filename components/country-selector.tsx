"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// List of countries where Netflix operates
const countries = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "uk", label: "United Kingdom" },
  { value: "fr", label: "France" },
  { value: "de", label: "Germany" },
  { value: "it", label: "Italy" },
  { value: "es", label: "Spain" },
  { value: "br", label: "Brazil" },
  { value: "mx", label: "Mexico" },
  { value: "au", label: "Australia" },
  { value: "jp", label: "Japan" },
  { value: "kr", label: "South Korea" },
  { value: "in", label: "India" },
  { value: "nl", label: "Netherlands" },
  { value: "se", label: "Sweden" },
  { value: "no", label: "Norway" },
  { value: "dk", label: "Denmark" },
  { value: "fi", label: "Finland" },
  { value: "pt", label: "Portugal" },
  { value: "pl", label: "Poland" },
  { value: "za", label: "South Africa" },
  { value: "sg", label: "Singapore" },
  { value: "my", label: "Malaysia" },
  { value: "ph", label: "Philippines" },
  { value: "th", label: "Thailand" },
  { value: "id", label: "Indonesia" },
  { value: "ar", label: "Argentina" },
  { value: "cl", label: "Chile" },
  { value: "co", label: "Colombia" },
  { value: "pe", label: "Peru" },
]

export default function CountrySelector() {
  const [open, setOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState(countries[0])

  // Load saved country from localStorage on component mount
  useEffect(() => {
    const savedCountry = localStorage.getItem("selectedCountry")
    if (savedCountry) {
      const country = countries.find((c) => c.value === savedCountry)
      if (country) {
        setSelectedCountry(country)
      }
    } else {
      // Try to detect user's country (simplified version)
      // In a real app, you might use a geolocation API
      const userLanguage = navigator.language || "en-US"
      const countryCode = userLanguage.split("-")[1]?.toLowerCase()
      if (countryCode) {
        const detectedCountry = countries.find((c) => c.value === countryCode)
        if (detectedCountry) {
          setSelectedCountry(detectedCountry)
          localStorage.setItem("selectedCountry", detectedCountry.value)
        }
      }
    }
  }, [])

  const handleSelect = (country: (typeof countries)[0]) => {
    setSelectedCountry(country)
    setOpen(false)
    localStorage.setItem("selectedCountry", country.value)

    // Dispatch a custom event so other components can react to country change
    window.dispatchEvent(new CustomEvent("countrychange", { detail: country.value }))
  }

  return (
    <div className="flex items-center">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-[180px] justify-between">
            <Globe className="mr-2 h-4 w-4 text-netflix-red" />
            {selectedCountry.label}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search country..." />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup className="max-h-[300px] overflow-y-auto">
                {countries.map((country) => (
                  <CommandItem key={country.value} value={country.value} onSelect={() => handleSelect(country)}>
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCountry.value === country.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {country.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
