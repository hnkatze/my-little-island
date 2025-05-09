"use client"

import { useEffect, useRef } from "react"
import { CldImage } from "next-cloudinary"
import { motion, useInView, useAnimation } from "framer-motion"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HeroSection() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      controls.start("visible") 
    }
  }, [controls, isInView])

  return (
    <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Imagen de fondo con Cloudinary */}
      <div className="absolute inset-0 z-0">
        <CldImage
          width="1920"
          height="1080"
          src="https://res.cloudinary.com/djluqrprg/image/upload/f_auto,q_auto/v1/mylittleisland/qs3vaau39byzoluzhcp0"
          alt="My Little Island Resort"
          priority
          className="object-cover w-full h-full"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAEtAJJXIDTjwAAAABJRU5ErkJggg=="
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Contenido del hero */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl" ref={ref}>
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
            hidden: { opacity: 0, y: 20 },
          }}
        >
          Bienvenido a My Little Island
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2 } },
            hidden: { opacity: 0, y: 20 },
          }}
        >
          Un paraíso exclusivo donde la naturaleza y el lujo se encuentran para ofrecerte una experiencia inolvidable
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.4 } },
            hidden: { opacity: 0, y: 20 },
          }}
        >
          <Link href="/reserva/confirmacion">
          <Button size="lg" variant="default" className="mr-4 bg-white text-primary hover:bg-white/90">
            Reservar ahora
          </Button>
          </Link>
          <Button size="lg" variant="outline" className="border-white text-primary hover:bg-white/80">
            Explorar
          </Button>
        </motion.div>
      </div>

      {/* Indicador de scroll */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
      >
        <div className="w-8 h-12 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2" />
        </div>
      </motion.div>
    </section>
  )
}
