"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, Home, Briefcase, House, Phone, Calendar } from "lucide-react"
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { isSignedIn, user } = useUser()

  const navLinks = [
    { href: "/", label: "Inicio", icon: Home },
    { href: "/#servicios", label: "Servicios", icon: Briefcase },
    { href: "/cabanas", label: "Cabañas", icon: House },
    { href: "/#contacto", label: "Contacto", icon: Phone },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="font-bold text-lg md:text-xl flex-1 md:flex-none">
          My Little Island
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                Iniciar Sesión
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button size="sm">
                Registrarse
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link href="/mis-reservas">
              <Button size="sm" variant="outline">
                Mis Reservas
              </Button>
            </Link>
            <UserButton 
              afterSignOutUrl="/" 
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8"
                }
              }}
            />
          </SignedIn>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] sm:w-[350px]">
            <SheetHeader>
              <SheetTitle>Menú</SheetTitle>
            </SheetHeader>
            
            {/* Mobile User Section */}
            {isSignedIn && user && (
              <>
                <div className="flex items-center gap-3 py-4">
                  <UserButton 
                    afterSignOutUrl="/" 
                    appearance={{
                      elements: {
                        avatarBox: "h-10 w-10"
                      }
                    }}
                  />
                  <div className="flex flex-col flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {user.firstName || user.emailAddresses[0].emailAddress}
                    </p>
                    <p className="text-xs text-muted-foreground">Mi cuenta</p>
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Mobile Navigation Links */}
            <nav className="flex flex-col gap-2 py-4">
              {navLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-2 py-2 text-base font-medium hover:text-primary hover:bg-accent rounded-md transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                )
              })}
              
              {isSignedIn && (
                <>
                  <Separator className="my-2" />
                  <Link
                    href="/mis-reservas"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-2 py-2 text-base font-medium hover:text-primary hover:bg-accent rounded-md transition-colors"
                  >
                    <Calendar className="h-5 w-5" />
                    Mis Reservas
                  </Link>
                </>
              )}
            </nav>

            {/* Mobile Auth Buttons */}
            {!isSignedIn && (
              <>
                <Separator />
                <div className="flex flex-col gap-3 py-4">
                  <SignInButton mode="modal">
                    <Button className="w-full" variant="outline">
                      Iniciar Sesión
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button className="w-full">
                      Registrarse
                    </Button>
                  </SignUpButton>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}