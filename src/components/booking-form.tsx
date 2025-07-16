"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format, addDays, differenceInDays } from "date-fns"
import { es } from "date-fns/locale"
import { useRouter } from "next/navigation"
import { useUser, SignInButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { createBooking, checkAvailability } from "@/lib/actions"
import { cn } from "@/lib/utils"
import useToast from "@/hooks/use-toast"

// Esquema de validación con Zod
const bookingFormSchema = z.object({
  checkIn: z.date({
    required_error: "Por favor selecciona una fecha de llegada.",
  }),
  checkOut: z.date({
    required_error: "Por favor selecciona una fecha de salida.",
  }),
  guests: z.string().min(1, "Por favor selecciona el número de huéspedes."),
  name: z.string().min(2, "Por favor ingresa tu nombre completo."),
  email: z.string().email("Por favor ingresa un email válido."),
  phone: z.string().min(6, "Por favor ingresa un número de teléfono válido."),
  specialRequests: z.string().optional(),
})

type BookingFormValues = z.infer<typeof bookingFormSchema>

interface BookingFormProps {
  cabinId: string
  cabinName: string
  price: number
  maxGuests: number
}

export default function BookingForm({ cabinId, cabinName, price, maxGuests }: BookingFormProps) {
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { isSignedIn, user } = useUser()

  // Obtener la fecha de hoy y mañana para valores iniciales
  const today = new Date()
  const tomorrow = addDays(today, 1)

  // Configurar el formulario con React Hook Form y Zod
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      checkIn: today,
      checkOut: tomorrow,
      guests: "1",
      name: "",
      email: "",
      phone: "",
      specialRequests: "",
    },
  })

  // Obtener valores actuales del formulario para cálculos
  const checkIn = form.watch("checkIn")
  const checkOut = form.watch("checkOut")

  // Calcular número de noches y precio total
  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 1
  const subtotal = price * nights
  const taxes = Math.round(subtotal * 0.12)
  const total = subtotal + taxes

  // Verificar disponibilidad antes de continuar
  const handleCheckAvailability = async () => {
    const { checkIn, checkOut } = form.getValues()

    if (!checkIn || !checkOut) {
      toast({
        title: "Error",
        description: "Por favor selecciona las fechas de llegada y salida.",
        variant: "destructive",
      })
      return
    }

    if (checkIn >= checkOut) {
      toast({
        title: "Error",
        description: "La fecha de salida debe ser posterior a la fecha de llegada.",
        variant: "destructive",
      })
      return
    }

    setIsCheckingAvailability(true)

    try {
      const available = await checkAvailability({
        cabinId,
        checkIn,
        checkOut,
      })

      setIsAvailable(available)

      if (available) {
        toast({
          title: "¡Disponible!",
          description: `La cabaña está disponible para las fechas seleccionadas.`,
        })
      } else {
        toast({
          title: "No disponible",
          description: "Lo sentimos, la cabaña no está disponible para las fechas seleccionadas.",
          variant: "destructive",
        })
      }
    } catch  {
      toast({
        title: "Error",
        description: "Ocurrió un error al verificar la disponibilidad. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsCheckingAvailability(false)
    }
  }

  // Enviar formulario
  const onSubmit = async (data: BookingFormValues) => {
    if (!isAvailable) {
      toast({
        title: "Verifica disponibilidad",
        description: "Por favor verifica la disponibilidad antes de continuar.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Asegurarnos de que las fechas sean objetos Date válidos
      const bookingData = {
        ...data,
        checkIn: new Date(data.checkIn),
        checkOut: new Date(data.checkOut),
        cabinId,
        cabinName,
        nights,
        price,
        subtotal,
        taxes,
        total,
      }

      console.log("Enviando reserva:", bookingData)
      const result = await createBooking(bookingData)

      if (result.success && result.bookingId) {
        toast({
          title: "¡Reserva confirmada!",
          description: `Tu reserva para ${cabinName} ha sido confirmada. Hemos enviado los detalles a tu correo.`,
        })

        // Redirigir a la página de confirmación
        router.push(`/reservas/confirmacion?id=${result.bookingId}`)
      } else {
        toast({
          title: "Error",
          description: result.error || "Error al procesar la reserva",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al crear reserva:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Ocurrió un error al procesar tu reserva. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {/* Fechas de llegada y salida */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="checkIn"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Llegada</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(field.value, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < today}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="checkOut"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Salida</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(field.value, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date <= checkIn || date < today}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Número de huéspedes */}
          <FormField
            control={form.control}
            name="guests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Huéspedes</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el número de huéspedes" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from({ length: maxGuests }, (_, i) => i + 1).map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? "huésped" : "huéspedes"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Botón de verificar disponibilidad */}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleCheckAvailability}
            disabled={isCheckingAvailability}
          >
            {isCheckingAvailability ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verificando...
              </>
            ) : (
              "Verificar disponibilidad"
            )}
          </Button>

          {/* Mostrar resultado de disponibilidad */}
          {isAvailable !== null && (
            <div
              className={`p-3 rounded-md text-center ${isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              {isAvailable
                ? "¡Disponible para las fechas seleccionadas!"
                : "No disponible para las fechas seleccionadas."}
            </div>
          )}

          {/* Información de contacto - solo mostrar si está disponible */}
          {isAvailable && (
            <>
              <Separator className="my-4" />
              <h3 className="text-lg font-medium">Información de contacto</h3>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Tu nombre completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input placeholder="tu@email.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 234 567 890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specialRequests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peticiones especiales (opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Indícanos si tienes alguna petición especial..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Alergias, preferencias, hora de llegada, etc.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {/* Resumen de costos */}
          <div className="pt-4 space-y-4">
            <div className="flex justify-between">
              <span>
                ${price} x {nights} {nights === 1 ? "noche" : "noches"}
              </span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Impuestos y tasas</span>
              <span>${taxes}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>
        </div>

        {/* Botón de reserva - requiere autenticación */}
        {!isSignedIn ? (
          <SignInButton mode="modal">
            <Button type="button" className="w-full">
              Iniciar sesión para reservar
            </Button>
          </SignInButton>
        ) : (
          <Button type="submit" className="w-full" disabled={!isAvailable || isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              "Reservar ahora"
            )}
          </Button>
        )}
      </form>
    </Form>
  )
}
