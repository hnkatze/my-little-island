import { redirect } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarDays, MapPin, Users, ArrowRight } from "lucide-react"
import { auth } from "@clerk/nextjs/server"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getUserBookings } from "@/lib/actions"

export default async function MisReservasPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/")
  }

  const result = await getUserBookings()

  if (!result.success || !result.bookings) {
    return (
      <main className="min-h-screen py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">Mis Reservas</h1>
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No se pudieron cargar tus reservas. Por favor, intenta nuevamente más tarde.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  const bookings = result.bookings

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Mis Reservas</h1>

        {bookings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Aún no tienes reservas.</p>
              <Button asChild>
                <Link href="/cabanas">Explorar Cabañas</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const isPast = new Date(booking.checkOut) < new Date()
              const isActive = new Date(booking.checkIn) <= new Date() && new Date(booking.checkOut) >= new Date()
              
              return (
                <Card key={booking.id} className={isPast ? "opacity-75" : ""}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{booking.cabin.name}</CardTitle>
                        <CardDescription>Reserva #{booking.id}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {isActive && (
                          <Badge variant="default" className="bg-green-500">Activa</Badge>
                        )}
                        <Badge variant={
                          booking.status === "CONFIRMED" ? "default" : 
                          booking.status === "CANCELLED" ? "destructive" : 
                          "secondary"
                        }>
                          {booking.status === "CONFIRMED" ? "Confirmada" :
                           booking.status === "CANCELLED" ? "Cancelada" :
                           booking.status === "PENDING" ? "Pendiente" :
                           "Completada"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        <div className="text-sm">
                          <p className="font-medium">Fechas</p>
                          <p className="text-muted-foreground">
                            {format(new Date(booking.checkIn), "d 'de' MMM", { locale: es })} - 
                            {format(new Date(booking.checkOut), "d 'de' MMM", { locale: es })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div className="text-sm">
                          <p className="font-medium">Huéspedes</p>
                          <p className="text-muted-foreground">{booking.guests} personas</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div className="text-sm">
                          <p className="font-medium">Cabaña</p>
                          <p className="text-muted-foreground">{booking.cabin.name}</p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Total pagado</p>
                        <p className="text-2xl font-bold">${booking.total}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Reservado el {format(new Date(booking.createdAt), "d 'de' MMMM 'de' yyyy", { locale: es })}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" asChild className="w-full">
                      <Link href={`/reservas/confirmacion?id=${booking.id}`} className="flex items-center justify-center gap-2">
                        Ver detalles
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}