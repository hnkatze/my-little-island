import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Utensils, GraduationCap, HousePlugIcon, MapPin, Users, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ServiceCard from "@/components/service-card"
import HeroSection from "@/components/hero-section"
import { prisma } from "@/lib/prisma"

export default async function Home() {
  // Obtener las primeras 3 cabañas desde la base de datos
  const cabins = await prisma.cabin.findMany({
    take: 3,
    orderBy: {
      price: 'asc'
    }
  })

  // Datos para los servicios
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
              <Card key={cabin.id} className="group overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={cabin.images[0]}
                    alt={cabin.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl">{cabin.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{cabin.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {cabin.amenities.slice(0, 3).map((amenity) => (
                      <Badge key={amenity} variant="secondary">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>Hasta {cabin.maxGuests} huéspedes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>Vista al mar</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-5 h-5" />
                    <span className="text-2xl font-bold">${cabin.price}</span>
                    <span className="text-muted-foreground">/noche</span>
                  </div>
                  <Button asChild>
                    <Link href={`/cabanas/${cabin.id}`}>Ver detalles</Link>
                  </Button>
                </CardFooter>
              </Card>
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
          <Button size="lg" asChild>
            <Link href="/cabanas">Reservar ahora</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}