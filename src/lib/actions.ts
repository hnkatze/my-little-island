"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

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
  price: z.number().positive(),
  subtotal: z.number().positive(),
  taxes: z.number().nonnegative(),
  total: z.number().positive(),
}).refine(data => data.checkOut > data.checkIn, {
  message: "La fecha de salida debe ser posterior a la de entrada",
  path: ["checkOut"]
}).refine(data => data.checkIn >= new Date(new Date().setHours(0, 0, 0, 0)), {
  message: "No se pueden hacer reservas en fechas pasadas",
  path: ["checkIn"]
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

    // Verificar si la cabaña existe
    const cabin = await prisma.cabin.findUnique({
      where: { id: cabinId }
    })

    if (!cabin) {
      throw new Error("Cabaña no encontrada")
    }

    // Buscar reservas que se solapan con las fechas solicitadas
    const conflictingBookings = await prisma.booking.findMany({
      where: {
        cabinId,
        status: { in: ["CONFIRMED", "PENDING"] },
        OR: [
          {
            AND: [
              { checkIn: { lte: checkIn } },
              { checkOut: { gt: checkIn } }
            ]
          },
          {
            AND: [
              { checkIn: { lt: checkOut } },
              { checkOut: { gte: checkOut } }
            ]
          },
          {
            AND: [
              { checkIn: { gte: checkIn } },
              { checkOut: { lte: checkOut } }
            ]
          }
        ]
      }
    })

    return conflictingBookings.length === 0
  } catch (error) {
    console.error("Error al verificar disponibilidad:", error)
    throw new Error("No se pudo verificar la disponibilidad")
  }
}

// Función para crear una reserva
export async function createBooking(data: unknown) {
  console.log("createBooking recibió:", data)
  
  try {
    // Obtener el usuario autenticado
    const { userId } = await auth()
    console.log("Usuario autenticado:", userId)

    if (!userId) {
      return {
        success: false,
        error: "Debes iniciar sesión para hacer una reserva",
      }
    }

    // Validar datos
    const validatedData = bookingSchema.parse(data)
    console.log("Datos validados:", validatedData)

    // Verificar disponibilidad nuevamente antes de crear la reserva
    const isAvailable = await checkAvailability({
      cabinId: validatedData.cabinId,
      checkIn: validatedData.checkIn,
      checkOut: validatedData.checkOut,
    })

    if (!isAvailable) {
      return {
        success: false,
        error: "La cabaña ya no está disponible para las fechas seleccionadas",
      }
    }

    // Crear la reserva en la base de datos
    const booking = await prisma.booking.create({
      data: {
        cabinId: validatedData.cabinId,
        userId,
        guestName: validatedData.name,
        guestEmail: validatedData.email,
        guestPhone: validatedData.phone,
        checkIn: validatedData.checkIn,
        checkOut: validatedData.checkOut,
        guests: parseInt(validatedData.guests),
        specialRequests: validatedData.specialRequests,
        nights: validatedData.nights,
        price: validatedData.price,
        subtotal: validatedData.subtotal,
        taxes: validatedData.taxes,
        total: validatedData.total,
        status: "CONFIRMED",
      },
      include: {
        cabin: true,
      },
    })

    // TODO: Enviar email de confirmación
    console.log("Nueva reserva creada:", booking)

    // Revalidar la ruta para actualizar los datos
    revalidatePath("/cabanas")
    revalidatePath(`/cabanas/${validatedData.cabinId}`)

    return {
      success: true,
      bookingId: booking.id,
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
    // Obtener el usuario autenticado
    const { userId } = await auth()

    if (!userId) {
      return {
        success: false,
        error: "Debes iniciar sesión para ver los detalles de la reserva",
      }
    }

    // Buscar la reserva en la base de datos
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        cabin: true,
      },
    })

    if (!booking) {
      return {
        success: false,
        error: "Reserva no encontrada",
      }
    }

    // Verificar que el usuario es el dueño de la reserva
    if (booking.userId !== userId) {
      return {
        success: false,
        error: "No tienes permiso para ver esta reserva",
      }
    }

    // Formatear la respuesta para que coincida con la interfaz esperada
    const formattedBooking = {
      id: booking.id,
      cabinId: booking.cabinId,
      cabinName: booking.cabin.name,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guests: booking.guests.toString(),
      name: booking.guestName,
      email: booking.guestEmail,
      phone: booking.guestPhone,
      specialRequests: booking.specialRequests,
      nights: booking.nights,
      price: booking.price,
      subtotal: booking.subtotal,
      taxes: booking.taxes,
      total: booking.total,
      status: booking.status,
      createdAt: booking.createdAt,
    }

    return {
      success: true,
      booking: formattedBooking,
    }
  } catch (error) {
    console.error("Error al obtener la reserva:", error)
    return {
      success: false,
      error: "No se pudo obtener la información de la reserva",
    }
  }
}

// Función para obtener todas las reservas del usuario
export async function getUserBookings() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return {
        success: false,
        error: "Debes iniciar sesión para ver tus reservas",
      }
    }

    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        cabin: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return {
      success: true,
      bookings,
    }
  } catch (error) {
    console.error("Error al obtener las reservas:", error)
    return {
      success: false,
      error: "No se pudieron obtener las reservas",
    }
  }
}
