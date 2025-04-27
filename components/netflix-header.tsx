"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, Menu, X } from "lucide-react"
import CountrySelector from "./country-selector"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <span className="text-primary font-bold text-2xl">
            Movie<span className="text-netflix-red">Mood</span>
          </span>
          <span className="bg-netflix-red text-white px-2 py-0.5 ml-2 text-xs rounded-full">by Kapisch</span>
        </Link>

        {/* Country Selector - Centered on desktop */}
        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
          <CountrySelector />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-foreground/80 hover:text-foreground transition-colors">
            Home
          </Link>
          <Link href="/discover" className="text-foreground/80 hover:text-foreground transition-colors">
            Discover
          </Link>
          <Link href="/recommendations" className="text-foreground/80 hover:text-foreground transition-colors">
            My Recommendations
          </Link>
          <Link href="/search">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-background border-b p-4 md:hidden">
            <div className="mb-4">
              <CountrySelector />
            </div>
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-foreground/80 hover:text-foreground transition-colors">
                Home
              </Link>
              <Link href="/discover" className="text-foreground/80 hover:text-foreground transition-colors">
                Discover
              </Link>
              <Link href="/recommendations" className="text-foreground/80 hover:text-foreground transition-colors">
                My Recommendations
              </Link>
              <Link href="/search" className="text-foreground/80 hover:text-foreground transition-colors">
                Search
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
