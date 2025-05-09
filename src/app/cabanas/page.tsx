'use client'
import { Button } from "@/components/ui/button"
import CabinPreview from "@/components/cabin-preview"

export default function CabinasPage() {
  // Datos de ejemplo para las cabañas (en un proyecto real, esto vendría de una API o base de datos)
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
    {
      id: "luxury-suite",
      name: "Suite de Lujo",
      description: "Nuestra cabaña más exclusiva con servicio personalizado y vistas panorámicas.",
      price: 450,
      capacity: 2,
      imageUrl: "https://res.cloudinary.com/djluqrprg/image/upload/f_auto,q_auto/v1/mylittleisland/cabanas/jsski9c2n55zzfqemq8c",
    },
    {
      id: "beach-bungalow",
      name: "Bungalow de Playa",
      description: "Acceso directo a la playa desde esta acogedora cabaña con hamacas y área de barbacoa.",
      price: 280,
      capacity: 3,
      imageUrl: "https://res.cloudinary.com/djluqrprg/image/upload/f_auto,q_auto/v1/mylittleisland/cabanas/hopnsjt96lta0jiccfh3",
    },
    {
      id: "eco-cabin",
      name: "Eco Cabaña",
      description: "Cabaña sostenible construida con materiales ecológicos y energía solar.",
      price: 220,
      capacity: 2,
      imageUrl: "https://res.cloudinary.com/djluqrprg/image/upload/f_auto,q_auto/v1/mylittleisland/cabanas/su8cngobnilfory7yjgu",
    },
  ]

  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Cabecera de la página */}
      <section className="w-full py-20 px-4 md:px-8 bg-primary/10 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Nuestras Cabañas</h1>
          <p className="text-muted-foreground text-lg mb-6">
            Descubre nuestras exclusivas opciones de alojamiento, diseñadas para brindarte la máxima comodidad en un
            entorno natural paradisíaco.
          </p>
        </div>
      </section>

      {/* Listado de cabañas */}
      <section className="w-full py-16 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
        </div>
      </section>

      {/* Sección de información adicional */}
      <section className="w-full py-16 px-4 md:px-8 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Información sobre las reservas</h2>
          <p className="text-muted-foreground mb-8">
            Todas nuestras cabañas incluyen desayuno, acceso a las instalaciones del resort y servicio de limpieza
            diario. Para reservas de grupos o eventos especiales, contáctanos directamente.
          </p>
          <Button size="lg">Contactar para reservas</Button>
        </div>
      </section>
    </main>
  )
}
