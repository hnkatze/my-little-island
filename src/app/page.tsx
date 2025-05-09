import Link from "next/link"
import { ArrowRight, Utensils, GraduationCap, HousePlugIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import ServiceCard from "@/components/service-card"
import HeroSection from "@/components/hero-section"
import CabinPreview from "@/components/cabin-preview"

export default function Home() {
  // Datos de ejemplo para los servicios
  const services = [
    {
      id: "restaurant",
      title: "Restaurante",
      description: "Disfruta de nuestra cocina local con ingredientes frescos y vistas al mar.",
      icon: <Utensils className="h-8 w-8 text-white" />,
      imageUrl: "https://res.cloudinary.com/djluqrprg/image/upload/f_auto,q_auto/v1/mylittleisland/fp2dllgckkuvdbzdstd0",
    },
    {
      id: "cabins",
      title: "Cabañas",
      description: "Alojamiento de lujo con todas las comodidades en un entorno natural paradisíaco.",
      icon: <HousePlugIcon className="h-8 w-8 text-white" />,
      imageUrl: "https://res.cloudinary.com/djluqrprg/image/upload/f_auto,q_auto/v1/mylittleisland/nmf22jqgzck4qywcgcxp",
    },
    {
      id: "internships",
      title: "Pasantías",
      description: "Programas de formación en hotelería y turismo sostenible en un entorno real.",
      icon: <GraduationCap className="h-8 w-8 text-white" />,
      imageUrl: "https://res.cloudinary.com/djluqrprg/image/upload/f_auto,q_auto/v1/mylittleisland/lcobtzuxhamncqbnn4ei",
    },
  ]

  // Datos de ejemplo para las cabañas
  const cabins = [
    {
      id: "ocean-view",
      name: "Cabaña Vista al Mar",
      description: "Espectaculares vistas al océano desde una cabaña de lujo con terraza privada.",
      price: 250,
      capacity: 2,
      imageUrl: "https://res.cloudinary.com/djluqrprg/image/upload/f_auto,q_auto/v1/mylittleisland/cabanas/jsski9c2n55zzfqemq8c",
    },
    {
      id: "garden-retreat",
      name: "Retiro del Jardín",
      description: "Cabaña rodeada de vegetación tropical con jacuzzi exterior privado.",
      price: 200,
      capacity: 2,
      imageUrl: "https://res.cloudinary.com/djluqrprg/image/upload/f_auto,q_auto/v1/mylittleisland/cabanas/su8cngobnilfory7yjgu",
    },
    {
      id: "family-cabin",
      name: "Cabaña Familiar",
      description: "Espaciosa cabaña para familias con dos habitaciones y área de juegos.",
      price: 350,
      capacity: 4,
      imageUrl: "https://res.cloudinary.com/djluqrprg/image/upload/f_auto,q_auto/v1/mylittleisland/cabanas/hopnsjt96lta0jiccfh3",
    },
  ]

  return (
    <main className="flex min-h-screen flex-col items-center">
      <HeroSection />

      {/* Sección de Servicios */}
      <section id="servicios" className="w-full py-20 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestros Servicios</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Descubre todo lo que My Little Island tiene para ofrecer, desde gastronomía excepcional hasta alojamiento
              de lujo y oportunidades de aprendizaje.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                title={service.title}
                description={service.description}
                icon={service.icon}
                imageUrl={service.imageUrl}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Sección de Cabañas */}
      <section id="cabanas" className="w-full py-20 px-4 md:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestras Cabañas</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Alojamiento exclusivo diseñado para brindar confort y privacidad en medio del paraíso.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cabins.map((cabin) => (
              <CabinPreview
                key={cabin.id}
                id={cabin.id}
                name={cabin.name}
                description={cabin.description}
                price={cabin.price}
                capacity={cabin.capacity}
                imageUrl={cabin.imageUrl}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/cabanas" className="flex items-center gap-2">
                Ver todas las cabañas
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Sección de Contacto */}
      <section id="contacto" className="w-full py-20 px-4 md:px-8 bg-primary/5">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Listo para visitarnos?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Reserva tu estancia en My Little Island y vive una experiencia inolvidable.
          </p>
          <Button size="lg">Reservar ahora</Button>
        </div>
      </section>
    </main>
  )
}
