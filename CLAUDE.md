# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server with Turbopack on http://localhost:3000
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture Overview

This is a Next.js 15 resort booking platform using the App Router pattern with React Server Components by default.

### Key Technologies
- **Next.js 15.3.2** with App Router and Turbopack
- **TypeScript** with strict mode
- **Tailwind CSS v4** (new @tailwindcss/postcss plugin)
- **Shadcn/ui** components (New York style)
- **React Hook Form + Zod** for form handling and validation
- **Framer Motion** for animations
- **Next Cloudinary** for image optimization

### Core Patterns

#### Server Components & Actions
- Components are Server Components by default
- Server Actions in `src/lib/actions.ts` handle data mutations with `"use server"` directive
- Form submissions use server actions for booking logic

#### Project Structure
```
src/
├── app/          # Pages using App Router
├── components/   # Reusable components
│   └── ui/      # Shadcn/ui components
├── lib/         # Server actions & utilities
├── hooks/       # Custom React hooks
└── types/       # TypeScript definitions
```

#### Booking System Flow
1. User browses cabins at `/cabanas`
2. Selects specific cabin at `/cabanas/[id]`
3. Fills booking form with availability check
4. Server action processes booking in `createBooking()`
5. Confirmation shown at `/reservas/confirmacion`

The booking system uses in-memory storage (for demo) with validation via Zod schemas.

#### Component Development
- Follow existing patterns in components directory
- Use Tailwind utilities with CSS custom properties for theming
- Components use TypeScript interfaces from `src/types/index.ts`
- Toast notifications via Sonner + custom hook in `use-toast.ts`

### Current State
The project is a luxury resort website ("My Little Island") with:
- Restaurant, Cabins, and Internship services
- Spanish language content
- Mobile-responsive design
- Active development on booking confirmation flow