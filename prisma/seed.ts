import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Eliminar datos existentes
  await prisma.booking.deleteMany()
  await prisma.cabin.deleteMany()

  // Crear cabañas
  const cabins = await prisma.cabin.createMany({
    data: [
      {
        name: "Refugio del Amanecer",
        description: "Una cabaña íntima con vista al mar y acceso privado a la playa",
        price: 250,
        maxGuests: 2,
        amenities: ["Vista al mar", "Jacuzzi privado", "Terraza", "Wifi", "Aire acondicionado"],
        images: [
          "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
          "https://images.unsplash.com/photo-1565895405227-31cffbe0cf86?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&q=80"
        ]
      },
      {
        name: "Villa Paraíso",
        description: "Amplia villa familiar con piscina privada y jardín tropical",
        price: 450,
        maxGuests: 6,
        amenities: ["Piscina privada", "Cocina completa", "BBQ", "3 habitaciones", "Sala de juegos"],
        images: [
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&q=80",
          "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&q=80"
        ]
      },
      {
        name: "Nido del Colibrí",
        description: "Cabaña ecológica en la copa de los árboles con vistas panorámicas",
        price: 320,
        maxGuests: 4,
        amenities: ["Vista panorámica", "Deck privado", "Hamacas", "Telescopio", "Cocina"],
        images: [
          "https://images.unsplash.com/photo-1488462237308-ecaa28b729d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&q=80",
          "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&q=80"
        ]
      },
      {
        name: "Casa del Atardecer",
        description: "Elegante cabaña con las mejores vistas del atardecer en la isla",
        price: 380,
        maxGuests: 4,
        amenities: ["Vista al atardecer", "Chimenea", "Bañera de hidromasaje", "Bar privado", "Smart TV"],
        images: [
          "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&q=80",
          "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&q=80"
        ]
      },
      {
        name: "Refugio Zen",
        description: "Espacio de tranquilidad con jardín de meditación y spa privado",
        price: 290,
        maxGuests: 2,
        amenities: ["Spa privado", "Jardín zen", "Clases de yoga", "Sauna", "Masajes incluidos"],
        images: [
          "https://images.unsplash.com/photo-1571992599285-ea98c758fe03?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&q=80",
          "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&q=80"
        ]
      },
      {
        name: "Palacio de Coral",
        description: "Lujosa villa sobre el agua con piso de cristal y acceso directo al arrecife",
        price: 550,
        maxGuests: 6,
        amenities: ["Sobre el agua", "Piso de cristal", "Mayordomo", "Muelle privado", "Equipo de snorkel"],
        images: [
          "https://images.unsplash.com/photo-1540202404-a2f29016b523?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&q=80",
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&q=80"
        ]
      }
    ]
  })

  console.log(`Database has been seeded with ${cabins.count} cabins`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })