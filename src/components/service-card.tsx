"use client"

import { useState } from "react"
import { CldImage } from "next-cloudinary"
import { motion } from "framer-motion"
import type { ReactNode } from "react"

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ServiceCardProps {
  title: string
  description: string
  icon: ReactNode
  imageUrl: string
}

export default function ServiceCard({ title, description, icon, imageUrl }: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ type: "spring", stiffness: 300 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <CldImage
            width="600"
            height="400"
            src={imageUrl.replace(/\.(jpg|png)$/, "")}
            alt={title}
            className="object-cover w-full h-full"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAEtAJJXIDTjwAAAABJRU5ErkJggg=="
            style={{
              transform: isHovered ? "scale(1.1)" : "scale(1)",
              transition: "transform 0.5s ease-in-out",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            <div className="bg-primary/90 p-2 rounded-full inline-block mb-2">{icon}</div>
          </div>
        </div>

        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>

        <CardFooter className="mt-auto">
          <Button variant="outline" className="w-full">
            Más información
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
