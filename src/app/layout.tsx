import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Link from "next/link"
import { Toaster } from "@/components/ui/toast"


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "My Little Island - Resort Paradisíaco",
  description:
    "Descubre nuestro exclusivo resort en una isla paradisíaca. Disfruta de cabañas de lujo, gastronomía excepcional y experiencias únicas.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <Link href="/" className="font-bold text-xl">
              My Little Island
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                Inicio
              </Link>
              <Link href="/#servicios" className="text-sm font-medium hover:text-primary transition-colors">
                Servicios
              </Link>
              <Link href="/cabanas" className="text-sm font-medium hover:text-primary transition-colors">
                Cabañas
              </Link>
              <Link href="/#contacto" className="text-sm font-medium hover:text-primary transition-colors">
                Contacto
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link
                href="#"
                className="hidden sm:inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                Reservar
              </Link>
              <button className="md:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-menu"
                >
                  <line x1="4" x2="20" y1="12" y2="12"></line>
                  <line x1="4" x2="20" y1="6" y2="6"></line>
                  <line x1="4" x2="20" y1="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        </header>

        {children}

        <footer className="w-full bg-slate-900 text-white py-12 px-4">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">My Little Island</h3>
              <p className="text-slate-300">
                Un paraíso exclusivo donde la naturaleza y el lujo se encuentran para ofrecerte una experiencia
                inolvidable.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Enlaces</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-slate-300 hover:text-white transition-colors">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link href="/#servicios" className="text-slate-300 hover:text-white transition-colors">
                    Servicios
                  </Link>
                </li>
                <li>
                  <Link href="/cabanas" className="text-slate-300 hover:text-white transition-colors">
                    Cabañas
                  </Link>
                </li>
                <li>
                  <Link href="/#contacto" className="text-slate-300 hover:text-white transition-colors">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contacto</h3>
              <address className="not-italic text-slate-300">
                <p>Isla Paradisíaca</p>
                <p>info@mylittleisland.com</p>
                <p>+1 (555) 123-4567</p>
              </address>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Síguenos</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-300 hover:text-white transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-facebook"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" className="text-slate-300 hover:text-white transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-instagram"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                  </svg>
                </a>
                <a href="#" className="text-slate-300 hover:text-white transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-twitter"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="container mx-auto mt-8 pt-8 border-t border-slate-800 text-center text-slate-400">
            <p>© {new Date().getFullYear()} My Little Island. Todos los derechos reservados.</p>
          </div>
        </footer>
        <Toaster />
      </body>
    </html>
  )
}
