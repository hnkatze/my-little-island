"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CheckCircle, ArrowLeft, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getBookingById } from "@/lib/actions"
import type { Booking } from "@/types"

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("id")

  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBooking() {
      if (!bookingId) {
        setError("No se encontró el ID de la reserva")
        setLoading(false)
        return
      }

      try {
        const result = await getBookingById(bookingId)

        if (result.success && result.booking) {
          setBooking(result.booking)
        } else {
          setError(result.error || "No se pudo encontrar la reserva")
        }
      } catch  {
        setError("Ocurrió un error al cargar los detalles de la reserva")
      } finally {
        setLoading(false)
      }
    }

    fetchBooking()
  }, [bookingId])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg">Cargando detalles de tu reserva...</p>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="mb-6">{error || "No se pudo encontrar la información de la reserva"}</p>
          <Button asChild>
            <Link href="/cabanas">Ver cabañas disponibles</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Button variant="outline" size="sm" asChild className="mb-8">
          <Link href="/cabanas" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver a cabañas
          </Link>
        </Button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">¡Reserva confirmada!</h1>
          <p className="text-muted-foreground">
            Gracias por elegir My Little Island. Hemos enviado los detalles a tu correo electrónico.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Detalles de la reserva</CardTitle>
            <CardDescription>Referencia: {booking.id}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Información de la cabaña</h3>
              <p className="text-lg font-semibold">{booking.cabinName}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Fechas</h3>
                <p>
                  <span className="block">Llegada: {format(new Date(booking.checkIn), "PPP", { locale: es })}</span>
                  <span className="block">Salida: {format(new Date(booking.checkOut), "PPP", { locale: es })}</span>
                  <span className="block text-sm text-muted-foreground mt-1">
                    {booking.nights} {booking.nights === 1 ? "noche" : "noches"}
                  </span>
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Huéspedes</h3>
                <p>
                  {booking.guests} {Number.parseInt(booking.guests) === 1 ? "huésped" : "huéspedes"}
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-2">Información de contacto</h3>
              <p className="grid grid-cols-1 gap-1">
                <span>{booking.name}</span>
                <span>{booking.email}</span>
                <span>{booking.phone}</span>
              </p>
            </div>

            {booking.specialRequests && (
              <div>
                <h3 className="font-medium mb-2">Peticiones especiales</h3>
                <p className="text-muted-foreground">{booking.specialRequests}</p>
              </div>
            )}

            <Separator />

            <div>
              <h3 className="font-medium mb-2">Resumen de pago</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>
                    ${booking.price} x {booking.nights} {booking.nights === 1 ? "noche" : "noches"}
                  </span>
                  <span>${booking.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Impuestos y tasas</span>
                  <span>${booking.taxes}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${booking.total}</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <p className="text-sm text-muted-foreground mb-2 w-full">
              El pago se realizará al momento del check-in. Puedes cancelar sin costo hasta 48 horas antes de la fecha
              de llegada.
            </p>
            <Button className="w-full" asChild>
              <Link href={`/cabanas/${booking.cabinId}`}>Ver detalles de la cabaña</Link>
            </Button>
          </CardFooter>
        </Card>

        <div className="bg-primary/5 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">¿Necesitas ayuda?</h2>
          <p className="text-muted-foreground mb-4">
            Si tienes alguna pregunta sobre tu reserva, no dudes en contactarnos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline">Contactar por WhatsApp</Button>
            <Button variant="outline">Enviar email</Button>
          </div>
        </div>
      </div>
    </main>
  )
}
