import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Users, Wifi, Coffee, Tv, Bath, Wind, MapPin, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"
import BookingForm from "@/components/booking-form"
import { prisma } from "@/lib/prisma"

// Mapeo de amenidades a iconos
const amenityIcons: Record<string, React.ReactNode> = {
  "Wifi": <Wifi className="h-5 w-5 text-primary" />,
  "Vista al mar": <MapPin className="h-5 w-5 text-primary" />,
  "Jacuzzi privado": <Bath className="h-5 w-5 text-primary" />,
  "Terraza": <Home className="h-5 w-5 text-primary" />,
  "Aire acondicionado": <Wind className="h-5 w-5 text-primary" />,
  "Cocina completa": <Coffee className="h-5 w-5 text-primary" />,
  "TV": <Tv className="h-5 w-5 text-primary" />,
}

export default async function CabinDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  // Obtener la cabaña de la base de datos
  const cabin = await prisma.cabin.findUnique({
    where: { id }
  })

  if (!cabin) {
    notFound()
  }

  // Obtener otras cabañas para la sección de "También te puede interesar"
  const relatedCabins = await prisma.cabin.findMany({
    where: {
      id: { not: cabin.id }
    },
    take: 3
  })

  return (
    <main className="flex min-h-screen flex-col">
      {/* Galería de imágenes */}
      <section className="relative w-full h-[60vh]">
        <Image
          src={cabin.images[0]}
          alt={cabin.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/30" />

        {/* Botón de volver */}
        <div className="absolute top-6 left-6">
          <Button variant="outline" size="sm" asChild className="bg-white/80 hover:bg-white">
            <Link href="/cabanas" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver a cabañas
            </Link>
          </Button>
        </div>

        {/* Título superpuesto */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 bg-gradient-to-t from-black to-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <Badge className="bg-primary text-white">${cabin.price} / noche</Badge>
              <div className="flex items-center text-white">
                <Users className="h-4 w-4 mr-1" />
                <span>Hasta {cabin.maxGuests} personas</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white">{cabin.name}</h1>
          </div>
        </div>
      </section>

      {/* Contenido principal */}
      <section className="w-full py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Información de la cabaña */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Descripción</h2>
              <p className="text-muted-foreground">{cabin.description}</p>
            </div>

            <Separator className="my-8" />

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Servicios incluidos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cabin.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    {amenityIcons[amenity] || <div className="h-2 w-2 rounded-full bg-primary" />}
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {cabin.images.length > 1 && (
              <>
                <Separator className="my-8" />
                <div>
                  <h2 className="text-2xl font-bold mb-6">Galería</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {cabin.images.slice(1).map((image, index) => (
                      <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                        <Image
                          src={image}
                          alt={`${cabin.name} - imagen ${index + 2}`}
                          fill
                          className="object-cover hover:scale-110 transition-transform duration-300"
                          sizes="(max-width: 768px) 50vw, 33vw"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Tarjeta de reserva */}
          <div>
            <Card className="sticky top-8 p-6">
              <h2 className="text-xl font-bold mb-4">Reserva tu estancia</h2>
              <BookingForm 
                cabinId={cabin.id} 
                cabinName={cabin.name} 
                price={cabin.price} 
                maxGuests={cabin.maxGuests} 
              />
            </Card>
          </div>
        </div>
      </section>

      {/* Sección de cabañas relacionadas */}
      {relatedCabins.length > 0 && (
        <section className="w-full py-12 px-4 md:px-8 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">También te puede interesar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedCabins.map((relatedCabin) => (
                <Link href={`/cabanas/${relatedCabin.id}`} key={relatedCabin.id} className="block">
                  <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
                    <div className="relative h-48">
                      <Image
                        src={relatedCabin.images[0]}
                        alt={relatedCabin.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-primary text-white">${relatedCabin.price} / noche</Badge>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold">{relatedCabin.name}</h3>
                      <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{relatedCabin.description}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}