export interface Booking {
    id: string
    cabinId: string
    cabinName: string
    checkIn: Date | string
    checkOut: Date | string
    guests: string
    name: string
    email: string
    phone: string
    specialRequests?: string
    nights: number
    subtotal: number
    taxes: number
    total: number
    status: string
    createdAt: Date | string
  }
  