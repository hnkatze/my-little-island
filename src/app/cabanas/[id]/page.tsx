'use client'
import { CldImage } from "next-cloudinary"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Users, Wifi, Coffee, Tv, Bath, Wind } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"
import BookingForm from "@/components/booking-form"
import { useEffect, useState } from "react"

interface Cabin {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  capacity: number;
  size: number; // m²
  bedType: string;
  imageUrl: string;
  galleryImages: string[];
  amenities: string[];
}

// En un proyecto real, esta información vendría de una base de datos
const cabinsData: Record<string, Cabin> = {
  "ocean-view": {
    id: "ocean-view",
    name: "Cabaña Vista al Mar",
    description:
      "Espectaculares vistas al océano desde una cabaña de lujo con terraza privada. Disfruta de atardeceres inolvidables desde tu propia terraza mientras escuchas el sonido relajante de las olas.",
    longDescription:
      "Nuestra Cabaña Vista al Mar es el alojamiento perfecto para parejas que buscan una escapada romántica o viajeros que desean disfrutar de la belleza natural de la isla en un entorno de lujo. La cabaña cuenta con una cama king-size, baño completo con ducha de lluvia, cocina equipada y una amplia terraza privada con vistas panorámicas al océano. El diseño interior combina elementos naturales con toques modernos para crear un ambiente acogedor y sofisticado. La ubicación privilegiada permite acceder fácilmente a la playa privada del resort.",
    price: 250,
    capacity: 2,
    size: 45, // m²
    bedType: "King",
    imageUrl: "https://res.cloudinary.com/djluqrprg/image/upload/f_auto,q_auto/v1/mylittleisland/cabanas/jsski9c2n55zzfqemq8c",
    galleryImages: ["https://res.cloudinary.com/djluqrprg/image/upload/f_auto,q_auto/v1/mylittleisland/cabanas/su8cngobnilfory7yjgu", "https://res.cloudinary.com/djluqrprg/image/upload/f_auto,q_auto/v1/mylittleisland/cabanas/jsski9c2n55zzfqemq8c", "https://res.cloudinary.com/djluqrprg/image/upload/f_auto,q_auto/v1/mylittleisland/nmf22jqgzck4qywcgcxp"],
    amenities: [
      "WiFi gratis",
      "Desayuno incluido",
      "Cocina equipada",
      "TV de pantalla plana",
      "Aire acondicionado",
      "Terraza privada",
    ],
  },
  "garden-retreat": {
    id: "garden-retreat",
    name: "Retiro del Jardín",
    description: "Cabaña rodeada de vegetación tropical con jacuzzi exterior privado.",
    longDescription:
      "El Retiro del Jardín es un oasis de tranquilidad rodeado de exuberante vegetación tropical. Esta cabaña ofrece privacidad absoluta y está diseñada para aquellos que buscan reconectarse con la naturaleza sin renunciar al confort. Cuenta con una cama queen-size, baño completo, sala de estar y una terraza exterior con jacuzzi privado. El diseño interior utiliza materiales naturales y colores terrosos para crear un ambiente relajante y en armonía con el entorno. Los huéspedes pueden disfrutar del canto de los pájaros y el aroma de las flores tropicales desde la comodidad de su propio espacio.",
    price: 200,
    capacity: 2,
    size: 40, // m²
    bedType: "Queen",
    imageUrl: "https://res.cloudinary.com/djluqrprg/image/upload/f_auto,q_auto/v1/mylittleisland/cabanas/jsski9c2n55zzfqemq8c",
    galleryImages: ["https://res.cloudinary.com/djluqrprg/image/upload/f_auto,q_auto/v1/mylittleisland/cabanas/su8cngobnilfory7yjgu", "https://res.cloudinary.com/djluqrprg/image/upload/f_auto,q_auto/v1/mylittleisland/cabanas/jsski9c2n55zzfqemq8c", "https://res.cloudinary.com/djluqrprg/image/upload/f_auto,q_auto/v1/mylittleisland/nmf22jqgzck4qywcgcxp"],
    amenities: [
      "WiFi gratis",
      "Desayuno incluido",
      "Jacuzzi privado",
      "TV de pantalla plana",
      "Aire acondicionado",
      "Terraza privada",
    ],
  },
  "family-cabin": {
    id: "family-cabin",
    name: "Cabaña Familiar",
    description: "Espaciosa cabaña para familias con dos habitaciones y área de juegos.",
    longDescription:
      "La Cabaña Familiar es perfecta para familias que buscan disfrutar de unas vacaciones inolvidables en My Little Island. Con dos habitaciones separadas, una con cama king-size y otra con dos camas individuales, ofrece espacio suficiente para que todos se sientan cómodos. La cabaña cuenta con dos baños completos, una amplia sala de estar, cocina totalmente equipada y un área exterior con zona de juegos para niños. El diseño interior es funcional y acogedor, con detalles pensados para todas las edades. Su ubicación dentro del resort permite fácil acceso a todas las instalaciones, incluyendo la piscina infantil y el restaurante.",
    price: 350,
    capacity: 4,
    size: 75, // m²
    bedType: "King y 2 individuales",
    imageUrl: "https://res.cloudinary.com/djluqrprg/image/upload/f_auto,q_auto/v1/mylittleisland/cabanas/jsski9c2n55zzfqemq8c",
    galleryImages: ["https://res.cloudinary.com/djluqrprg/image/upload/f_auto,q_auto/v1/mylittleisland/cabanas/su8cngobnilfory7yjgu", "https://res.cloudinary.com/djluqrprg/image/upload/f_auto,q_auto/v1/mylittleisland/cabanas/jsski9c2n55zzfqemq8c", "https://res.cloudinary.com/djluqrprg/image/upload/f_auto,q_auto/v1/mylittleisland/nmf22jqgzck4qywcgcxp"],
    amenities: [
      "WiFi gratis",
      "Desayuno incluido",
      "Cocina equipada",
      "TV de pantalla plana",
      "Aire acondicionado",
      "Área de juegos",
    ],
  },
}

export default  function CabinDetailPage({ params }: {  params: Promise<{ id: string }> }) {
  const [cabin, setCabin] = useState<Cabin | null>(null)

  useEffect(() => {
    const fetchCabin = async () => {
      const { id } = await params
      const selectedCabin = cabinsData[id]

      // Si no existe la cabaña, redirigir a 404
      if (!selectedCabin) {
        notFound()
      } else {
        setCabin(selectedCabin)
      }
    }

    fetchCabin()
  }, [params])

  if (!cabin) {
    return null // O un loader mientras se carga la información
  }
  

  return (
    <main className="flex min-h-screen flex-col">
      {/* Galería de imágenes */}
      <section className="relative w-full h-[60vh]">
        <CldImage
          width="1920"
          height="1080"
          src={cabin.imageUrl.replace(/\.(jpg|png)$/, "")}
          alt={cabin.name}
          className="object-cover w-full h-full"
          priority
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAEtAJJXIDTjwAAAABJRU5ErkJggg=="
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
                <span>{cabin.capacity} personas</span>
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
              <p className="text-muted-foreground mb-4">{cabin.description}</p>
              <p className="text-muted-foreground">{cabin.longDescription}</p>
            </div>

            <Separator className="my-8" />

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Características</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>{cabin.capacity} personas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-5 w-5 text-primary" />
                  <span>Baño completo</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wifi className="h-5 w-5 text-primary" />
                  <span>WiFi gratis</span>
                </div>
                <div className="flex items-center gap-2">
                  <Coffee className="h-5 w-5 text-primary" />
                  <span>Desayuno incluido</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tv className="h-5 w-5 text-primary" />
                  <span>TV pantalla plana</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="h-5 w-5 text-primary" />
                  <span>Aire acondicionado</span>
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            <div>
              <h2 className="text-2xl font-bold mb-6">Servicios incluidos</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
                {cabin.amenities.map((amenity, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span>{amenity}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tarjeta de reserva */}
          <div>
            <Card className="sticky top-8 p-6">
              <h2 className="text-xl font-bold mb-4">Reserva tu estancia</h2>
              <BookingForm cabinId={cabin.id} cabinName={cabin.name} price={cabin.price} maxGuests={cabin.capacity} />
            </Card>
          </div>
        </div>
      </section>

      {/* Sección de cabañas relacionadas */}
      <section className="w-full py-12 px-4 md:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">También te puede interesar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.values(cabinsData)
              .filter((c) => c.id !== cabin.id)
              .slice(0, 3)
              .map((relatedCabin) => (
                <Link href={`/cabanas/${relatedCabin.id}`} key={relatedCabin.id} className="block">
                  <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
                    <div className="relative h-48">
                      <CldImage
                        width="600"
                        height="400"
                        src={relatedCabin.imageUrl.replace(/\.(jpg|png)$/, "")}
                        alt={relatedCabin.name}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-primary text-white">${relatedCabin.price} / noche</Badge>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold">{relatedCabin.name}</h3>
                      <p className="text-muted-foreground text-sm mt-1">{relatedCabin.description}</p>
                    </div>
                  </Card>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </main>
  )
}
