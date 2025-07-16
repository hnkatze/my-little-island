# Instrucciones para Implementar el Backoffice - My Little Island

## 🎯 Objetivo
Crear un sistema de administración (backoffice) para gestionar las reservas, cabañas y usuarios del resort My Little Island.

## 🏗️ Arquitectura Recomendada

### Stack Tecnológico
- **Frontend**: Next.js 15 con App Router
- **Autenticación**: Clerk (con roles de admin)
- **Base de datos**: MongoDB (la misma que usa el sitio principal)
- **ORM**: Prisma
- **UI**: Shadcn/ui + Tailwind CSS
- **Gráficos**: Recharts o Tremor para dashboard

## 📋 Funcionalidades Principales

### 1. Dashboard Principal
- **Métricas clave**:
  - Total de reservas (hoy, semana, mes)
  - Ingresos totales
  - Tasa de ocupación
  - Cabañas disponibles/ocupadas
- **Gráficos**:
  - Reservas por mes
  - Ingresos por período
  - Ocupación por cabaña

### 2. Gestión de Reservas
- **Lista de reservas** con filtros:
  - Por fecha (check-in/check-out)
  - Por estado (pendiente, confirmada, cancelada, completada)
  - Por cabaña
  - Por cliente
- **Acciones**:
  - Ver detalles completos
  - Cambiar estado
  - Cancelar reserva
  - Editar información
  - Enviar email al cliente
  - Generar comprobante/factura

### 3. Gestión de Cabañas
- **CRUD completo**:
  - Crear nueva cabaña
  - Editar información (nombre, descripción, precio, amenidades)
  - Subir/gestionar imágenes
  - Activar/desactivar cabaña
- **Calendario de disponibilidad**:
  - Vista mensual de ocupación
  - Bloquear fechas manualmente
  - Precios especiales por temporada

### 4. Gestión de Clientes
- **Lista de usuarios registrados**
- **Historial de reservas por cliente**
- **Información de contacto**
- **Notas internas sobre el cliente**

### 5. Reportes y Analytics
- **Reportes exportables (PDF/Excel)**:
  - Reporte de ingresos
  - Reporte de ocupación
  - Lista de check-ins/check-outs del día
  - Reporte de clientes frecuentes

## 🔧 Implementación Paso a Paso

### Paso 1: Configuración Inicial
```bash
# Crear nuevo proyecto Next.js
npx create-next-app@latest my-little-island-admin --typescript --tailwind --app

# Instalar dependencias
npm install @clerk/nextjs @prisma/client prisma lucide-react recharts
npm install @radix-ui/react-dialog @radix-ui/react-select
npm install date-fns react-hook-form @hookform/resolvers zod
npm install @tanstack/react-table
```

### Paso 2: Configurar Clerk con Roles
1. En el dashboard de Clerk, crear roles:
   - `admin`: Acceso completo
   - `staff`: Acceso limitado (sin reportes financieros)
   
2. Configurar middleware para proteger todas las rutas:
```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(['(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
    
    // Verificar rol de admin
    const { sessionClaims } = await auth();
    const userRole = sessionClaims?.metadata?.role;
    
    if (userRole !== 'admin' && userRole !== 'staff') {
      return new Response('Unauthorized', { status: 403 });
    }
  }
});
```

### Paso 3: Compartir Base de Datos
Usar la misma conexión de MongoDB y modelos de Prisma:
```bash
# Copiar schema.prisma del proyecto principal
# Usar la misma DATABASE_URL en .env
```

## 📊 Tipos de Datos y Modelos

### Modelos de Prisma (schema.prisma)
```prisma
model Cabin {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  description String
  price       Float
  maxGuests   Int
  amenities   String[]
  images      String[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  bookings    Booking[]
}

model Booking {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  cabinId         String   @db.ObjectId
  cabin           Cabin    @relation(fields: [cabinId], references: [id])
  userId          String   // Clerk user ID
  guestName       String
  guestEmail      String
  guestPhone      String
  checkIn         DateTime
  checkOut        DateTime
  guests          Int
  specialRequests String?
  nights          Int
  price           Float
  subtotal        Float
  taxes           Float
  total           Float
  status          BookingStatus @default(PENDING)
  paymentId       String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

enum BookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
}
```

### TypeScript Interfaces
```typescript
// types/index.ts

// Tipos base que coinciden con Prisma
export interface Cabin {
  id: string
  name: string
  description: string
  price: number
  maxGuests: number
  amenities: string[]
  images: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Booking {
  id: string
  cabinId: string
  cabin?: Cabin
  userId: string
  guestName: string
  guestEmail: string
  guestPhone: string
  checkIn: Date
  checkOut: Date
  guests: number
  specialRequests?: string
  nights: number
  price: number
  subtotal: number
  taxes: number
  total: number
  status: BookingStatus
  paymentId?: string
  createdAt: Date
  updatedAt: Date
}

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED"
}

// Tipos para el dashboard
export interface DashboardStats {
  totalBookings: number
  totalRevenue: number
  occupancyRate: number
  availableCabins: number
  todayCheckIns: number
  todayCheckOuts: number
  monthlyGrowth: number
}

export interface RevenueByPeriod {
  date: string
  revenue: number
  bookings: number
}

export interface OccupancyByCabin {
  cabinId: string
  cabinName: string
  occupancyRate: number
  totalNights: number
  revenue: number
}

// Tipos para filtros y búsqueda
export interface BookingFilters {
  status?: BookingStatus
  cabinId?: string
  dateFrom?: Date
  dateTo?: Date
  searchTerm?: string
  page?: number
  limit?: number
  sortBy?: 'createdAt' | 'checkIn' | 'total'
  sortOrder?: 'asc' | 'desc'
}

export interface CabinFilters {
  minPrice?: number
  maxPrice?: number
  minGuests?: number
  available?: boolean
  page?: number
  limit?: number
}

// Tipos para formularios
export interface CreateCabinInput {
  name: string
  description: string
  price: number
  maxGuests: number
  amenities: string[]
  images: string[]
}

export interface UpdateCabinInput extends Partial<CreateCabinInput> {
  id: string
}

export interface UpdateBookingStatusInput {
  bookingId: string
  status: BookingStatus
  notes?: string
  notifyCustomer?: boolean
}

// Tipos para reportes
export interface BookingReport {
  period: 'daily' | 'weekly' | 'monthly' | 'yearly'
  startDate: Date
  endDate: Date
  totalBookings: number
  totalRevenue: number
  averageStayLength: number
  averageBookingValue: number
  topCabins: Array<{
    cabinId: string
    cabinName: string
    bookings: number
    revenue: number
  }>
  bookingsByStatus: Record<BookingStatus, number>
}

// Tipos para usuarios (extender el de Clerk)
export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  imageUrl?: string
  role: 'admin' | 'staff'
  createdAt: Date
  lastSignInAt?: Date
  bookings?: Booking[]
}

// Tipos para notificaciones
export interface Notification {
  id: string
  type: 'new_booking' | 'cancellation' | 'check_in_reminder'
  title: string
  message: string
  bookingId?: string
  read: boolean
  createdAt: Date
}

// Tipos para calendario de disponibilidad
export interface CalendarEvent {
  id: string
  cabinId: string
  title: string
  start: Date
  end: Date
  type: 'booking' | 'maintenance' | 'blocked'
  bookingId?: string
}

// Tipos para respuestas de API
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  totalPages: number
  hasMore: boolean
}
```

### Validación con Zod
```typescript
// lib/validations.ts
import { z } from 'zod'

export const createCabinSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(10).max(500),
  price: z.number().positive(),
  maxGuests: z.number().int().min(1).max(10),
  amenities: z.array(z.string()).min(1),
  images: z.array(z.string().url()).min(1).max(10),
})

export const updateBookingStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']),
  notes: z.string().optional(),
  notifyCustomer: z.boolean().default(true),
})

export const bookingFiltersSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']).optional(),
  cabinId: z.string().optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  searchTerm: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  sortBy: z.enum(['createdAt', 'checkIn', 'total']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})
```

### Paso 4: Estructura de Carpetas
```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx (Dashboard)
│   ├── reservas/
│   │   ├── page.tsx (Lista)
│   │   └── [id]/page.tsx (Detalle)
│   ├── cabanas/
│   │   ├── page.tsx (Lista)
│   │   ├── nueva/page.tsx
│   │   └── [id]/
│   │       └── editar/page.tsx
│   ├── clientes/
│   │   ├── page.tsx (Lista)
│   │   └── [id]/page.tsx (Detalle)
│   └── reportes/
│       └── page.tsx
├── components/
│   ├── ui/ (shadcn components)
│   ├── dashboard/
│   │   ├── stats-card.tsx
│   │   ├── revenue-chart.tsx
│   │   └── occupancy-chart.tsx
│   ├── bookings/
│   │   ├── booking-table.tsx
│   │   ├── booking-filters.tsx
│   │   └── booking-status-badge.tsx
│   └── layout/
│       ├── sidebar.tsx
│       └── header.tsx
└── lib/
    ├── actions/ (server actions)
    ├── utils.ts
    └── prisma.ts
```

### Paso 5: Componentes Clave

#### Layout con Sidebar
```typescript
// components/layout/sidebar.tsx
const menuItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/reservas', label: 'Reservas', icon: Calendar },
  { href: '/cabanas', label: 'Cabañas', icon: Home },
  { href: '/clientes', label: 'Clientes', icon: Users },
  { href: '/reportes', label: 'Reportes', icon: FileText },
];
```

#### Tabla de Reservas con Filtros
```typescript
// Usar @tanstack/react-table para tabla avanzada
// Incluir filtros de fecha, estado, búsqueda
// Acciones inline para cada reserva
```

### Paso 6: Server Actions Necesarios

```typescript
// lib/actions/bookings.ts
export async function getBookingStats(period: 'day' | 'week' | 'month') {
  // Estadísticas para dashboard
}

export async function updateBookingStatus(bookingId: string, status: BookingStatus) {
  // Cambiar estado de reserva
}

export async function getBookingsWithFilters(filters: BookingFilters) {
  // Lista filtrada con paginación
}

// lib/actions/cabins.ts
export async function updateCabin(cabinId: string, data: UpdateCabinInput) {
  // Actualizar información de cabaña
}

export async function toggleCabinAvailability(cabinId: string, dates: Date[]) {
  // Bloquear/desbloquear fechas
}
```

## 🎨 UI/UX Consideraciones

### Dashboard
- Cards con métricas principales arriba
- Gráficos de tendencias en el centro
- Tabla de reservas recientes abajo
- Notificaciones de nuevas reservas en tiempo real

### Tablas
- Paginación del lado del servidor
- Ordenamiento por columnas
- Búsqueda en tiempo real
- Acciones rápidas con dropdowns
- Estado visual con badges de colores

### Formularios
- Validación en tiempo real
- Feedback visual de errores
- Confirmación antes de acciones destructivas
- Toast notifications para feedback

## 🔒 Seguridad

1. **Validar todos los inputs** en el servidor
2. **Verificar permisos** en cada acción
3. **Logs de auditoría** para cambios importantes
4. **Rate limiting** para prevenir abuso
5. **Backup automático** de datos

## 📱 Responsive Design

- Sidebar colapsable en móvil
- Tablas con scroll horizontal
- Cards apiladas verticalmente
- Acciones adaptadas para touch

## 🚀 Deployment

### Opción 1: Mismo dominio con subdirectorio
```
my-little-island.com/admin
```

### Opción 2: Subdominio
```
admin.my-little-island.com
```

### Variables de Entorno Necesarias
```env
DATABASE_URL=mongodb+srv://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_APP_URL=https://my-little-island.com
```

## 📊 Métricas Adicionales a Considerar

1. **Análisis de temporadas**
2. **Predicción de ocupación**
3. **Segmentación de clientes**
4. **ROI por canal de marketing**
5. **Satisfacción del cliente**

## 🔄 Integraciones Futuras

1. **Sistema de emails** (SendGrid/Resend)
2. **Pasarela de pagos** (Stripe)
3. **Calendar sync** (Google Calendar)
4. **WhatsApp Business API**
5. **Sistema de facturación**

## 📝 Notas Importantes

- Reutilizar componentes del sitio principal cuando sea posible
- Mantener consistencia visual con la marca
- Implementar caché para queries frecuentes
- Considerar webhooks para actualizaciones en tiempo real
- Documentar todas las funciones del backoffice para el personal

Este backoffice debe ser intuitivo para que el personal del resort pueda gestionar las operaciones diarias sin necesidad de conocimientos técnicos.