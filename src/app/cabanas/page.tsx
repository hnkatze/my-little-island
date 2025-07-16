import Link from "next/link"
import Image from "next/image"
import { MapPin, Users, DollarSign } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { prisma } from "@/lib/prisma"

export default async function CabinsPage() {
  // Obtener todas las cabañas de la base de datos
  const cabins = await prisma.cabin.findMany({
    orderBy: {
      price: 'asc'
    }
  })

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Nuestras Cabañas</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Descubre nuestras exclusivas cabañas, cada una diseñada para ofrecerte una experiencia única en medio del
            paraíso tropical.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  {cabin.amenities.length > 3 && (
                    <Badge variant="outline">+{cabin.amenities.length - 3} más</Badge>
                  )}
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
      </div>
    </main>
  )
}