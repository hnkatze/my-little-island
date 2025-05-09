"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

// Simulación de base de datos para reservas
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const bookings: any[] = []
let bookingIdCounter = 1

// Esquema para validar datos de disponibilidad
const availabilitySchema = z.object({
  cabinId: z.string(),
  checkIn: z.date(),
  checkOut: z.date(),
})

// Esquema para validar datos de reserva
const bookingSchema = z.object({
  cabinId: z.string(),
  cabinName: z.string(),
  checkIn: z.date(),
  checkOut: z.date(),
  guests: z.string(),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  specialRequests: z.string().optional(),
  nights: z.number().int().positive(),
  subtotal: z.number().positive(),
  taxes: z.number().nonnegative(),
  total: z.number().positive(),
})

// Función para verificar disponibilidad
export async function checkAvailability(data: {
  cabinId: string
  checkIn: Date
  checkOut: Date
}) {
  try {
    // Validar datos
    const { cabinId, checkIn, checkOut } = availabilitySchema.parse(data)

    // Simular una llamada a la API o base de datos
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simulación de lógica de disponibilidad
    // En un caso real, consultaríamos una base de datos

    // Para demostración, hacemos que algunas fechas no estén disponibles
    const checkInTime = checkIn.getTime()
    const isWeekend = checkIn.getDay() === 0 || checkIn.getDay() === 6

    // Verificar si ya existe una reserva para esas fechas
    const existingBooking = bookings.some((booking) => {
      const bookingCheckIn = new Date(booking.checkIn).getTime()
      const bookingCheckOut = new Date(booking.checkOut).getTime()

      return (
        booking.cabinId === cabinId &&
        ((checkInTime >= bookingCheckIn && checkInTime < bookingCheckOut) ||
          (bookingCheckIn >= checkInTime && bookingCheckIn < new Date(checkOut).getTime()))
      )
    })

    // Para demostración, hacemos que los fines de semana tengan menos disponibilidad
    const randomAvailability = Math.random() > (isWeekend ? 0.3 : 0.1)

    return !existingBooking && randomAvailability
  } catch (error) {
    console.error("Error al verificar disponibilidad:", error)
    throw new Error("No se pudo verificar la disponibilidad")
  }
}

// Función para crear una reserva
export async function createBooking(data: unknown) {
  try {
    // Validar datos
    const validatedData = bookingSchema.parse(data)

    // Simular una llamada a la API o base de datos
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Crear un ID único para la reserva
    const bookingId = `RES-${bookingIdCounter++}-${Date.now().toString().slice(-4)}`

    // Crear objeto de reserva
    const newBooking = {
      id: bookingId,
      ...validatedData,
      status: "confirmed",
      createdAt: new Date(),
    }

    // Guardar la reserva en nuestra "base de datos" simulada
    bookings.push(newBooking)

    // En un caso real, enviaríamos un email de confirmación aquí
    console.log("Nueva reserva creada:", newBooking)

    // Revalidar la ruta para actualizar los datos
    revalidatePath("/cabanas/[id]")

    return {
      success: true,
      bookingId,
    }
  } catch (error) {
    console.error("Error al crear la reserva:", error)

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Datos de reserva inválidos",
        validationErrors: error.errors,
      }
    }

    return {
      success: false,
      error: "No se pudo procesar la reserva",
    }
  }
}

// Función para obtener una reserva por ID
export async function getBookingById(id: string) {
  try {
    // Simular una llamada a la API o base de datos
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Buscar la reserva en nuestra "base de datos" simulada
    const booking = bookings.find((b) => b.id === id)

    if (!booking) {
      return {
        success: false,
        error: "Reserva no encontrada",
      }
    }

    return {
      success: true,
      booking,
    }
  } catch (error) {
    console.error("Error al obtener la reserva:", error)
    return {
      success: false,
      error: "No se pudo obtener la información de la reserva",
    }
  }
}
