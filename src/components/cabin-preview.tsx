"use client"

import { CldImage } from "next-cloudinary"
import { motion } from "framer-motion"
import Link from "next/link"
import { Users } from "lucide-react"

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface CabinPreviewProps {
  id: string
  name: string
  description: string
  price: number
  capacity: number
  imageUrl: string
}

export default function CabinPreview({ id, name, description, price, capacity, imageUrl }: CabinPreviewProps) {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
      <Card className="overflow-hidden h-full flex flex-col">
        <div className="relative h-56 overflow-hidden">
          <CldImage
            width="600"
            height="400"
            src={imageUrl.replace(/\.(jpg|png)$/, "")}
            alt={name}
            className="object-cover w-full h-full"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAEtAJJXIDTjwAAAABJRU5ErkJggg=="
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
            whileHover={{ opacity: 0.3 }}
            transition={{ duration: 0.3 }}
          />
          <div className="absolute top-4 right-4">
            <Badge className="bg-primary text-white">${price} / noche</Badge>
          </div>
        </div>

        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{name}</CardTitle>
            <div className="flex items-center text-muted-foreground">
              <Users className="h-4 w-4 mr-1" />
              <span className="text-sm">{capacity}</span>
            </div>
          </div>
          <CardDescription>{description}</CardDescription>
        </CardHeader>

        <CardFooter className="mt-auto pt-0">
          <Button asChild className="w-full">
            <Link href={`/cabanas/${id}`}>Ver detalles</Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
