import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  await prisma.category.createMany({
    data: [
      {
        name: "Food and Cafes",
        slug: "food-cafes",
        icon: "🍽️",
        color: "#FF6B6B",
        description: "Restaurants, cafes, traditional cuisine",
      },
      {
        name: "History and Culture",
        slug: "history-culture",
        icon: "🏛️",
        color: "#9B59B6",
        description: "Museums, monuments, historical places",
      },
      {
        name: "Nature and Activities",
        slug: "nature-activities",
        icon: "🏔️",
        color: "#3498DB",
        description: "Mountains, lakes, trekking, nature parks",
      },
      {
        name: "Shopping and Walks",
        slug: "shopping-walks",
        icon: "🛍️",
        color: "#F39C12",
        description: "Markets, shopping centers, parks",
      },
      {
        name: "Art and Creative",
        slug: "art-creative",
        icon: "🎨",
        color: "#E91E63",
        description: "Galleries, art spaces, creative places",
      },
      {
        name: "Nightlife",
        slug: "nightlife",
        icon: "🌃",
        color: "#34495E",
        description: "Bars, clubs, evening events",
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Categories created");

  const foodCategory = await prisma.category.findUnique({
    where: { slug: "food-cafes" },
  });
  const historyCategory = await prisma.category.findUnique({
    where: { slug: "history-culture" },
  });
  const natureCategory = await prisma.category.findUnique({
    where: { slug: "nature-activities" },
  });
  const shoppingCategory = await prisma.category.findUnique({
    where: { slug: "shopping-walks" },
  });
  const artCategory = await prisma.category.findUnique({
    where: { slug: "art-creative" },
  });

  const places = [
    {
      name: "Navat",
      slug: "navat",
      category: { connect: { id: foodCategory!.id } },
      description:
        "Traditional restaurant with national cuisine. Famous for beshbarmak and lagman.",
      address: "Togolok Moldo St., Bishkek",
      lat: 42.8746,
      lng: 74.5698,
      photos: ["https://example.com/navat.jpg"],
      priceRange: "medium",
      rating: 4.7,
      openingHours:
        "Mon-Thu 10:00-23:00; Fri-Sat 10:00-00:00; Sun 10:00-23:00",
    },
    {
      name: "Coffeedelia",
      slug: "coffeedelia",
      category: { connect: { id: foodCategory!.id } },
      description:
        "Cozy coffee shop with great coffee and desserts. Popular with locals.",
      address: "Chuy Ave., Bishkek",
      lat: 42.8765,
      lng: 74.6033,
      photos: ["https://example.com/coffeedelia.jpg"],
      priceRange: "low",
      rating: 4.5,
      openingHours:
        "Mon-Thu 08:00-22:00; Fri 08:00-23:00; Sat 09:00-23:00; Sun 09:00-22:00",
    },

    {
      name: "Ala-Too Square",
      slug: "ala-too-square",
      category: { connect: { id: historyCategory!.id } },
      description:
        "Central square of Bishkek. Venue for parades and city events.",
      address: "Chuy Ave., Bishkek",
      lat: 42.8746,
      lng: 74.6066,
      photos: ["https://example.com/ala-too.jpg"],
      priceRange: "free",
      rating: 4.6,
    },
    {
      name: "State Historical Museum",
      slug: "history-museum",
      category: { connect: { id: historyCategory!.id } },
      description:
        "The main historical museum of Kyrgyzstan with a rich collection.",
      address: "Ala-Too Sq., Bishkek",
      lat: 42.8751,
      lng: 74.607,
      photos: ["https://example.com/museum.jpg"],
      priceRange: "low",
      rating: 4.4,
      openingHours: "Mon Closed; Tue-Sun 09:00-17:00",
    },

    {
      name: "Ala-Archa",
      slug: "ala-archa",
      category: { connect: { id: natureCategory!.id } },
      description:
        "National park 40 km from Bishkek. Trekking, picnics, beautiful views.",
      address: "Ala-Archa District",
      lat: 42.55,
      lng: 74.4833,
      photos: ["https://example.com/ala-archa.jpg"],
      priceRange: "low",
      rating: 4.9,
    },
    {
      name: "Issyk-Kul",
      slug: "issyk-kul",
      category: { connect: { id: natureCategory!.id } },
      description:
        "The second-largest alpine lake in the world. Beaches, resorts, clean air.",
      address: "Issyk-Kul Region",
      lat: 42.4333,
      lng: 77.0833,
      photos: ["https://example.com/issyk-kul.jpg"],
      priceRange: "medium",
      rating: 5.0,
    },

    {
      name: "Osh Bazaar",
      slug: "osh-bazaar",
      category: { connect: { id: shoppingCategory!.id } },
      description:
        "The largest market in Bishkek. Fruits, vegetables, spices, clothing, souvenirs.",
      address: "Beishenaliev St., Bishkek",
      lat: 42.8691,
      lng: 74.5864,
      photos: ["https://example.com/osh-bazaar.jpg"],
      priceRange: "low",
      rating: 4.3,
      openingHours: "Daily 06:00-19:00",
    },
    {
      name: "Oak Park",
      slug: "oak-park",
      category: { connect: { id: shoppingCategory!.id } },
      description: "Central park of Bishkek. Walks, attractions, cafes.",
      address: "Erkindik Ave., Bishkek",
      lat: 42.8777,
      lng: 74.6122,
      photos: ["https://example.com/oak-park.jpg"],
      priceRange: "free",
      rating: 4.5,
    },

    {
      name: "Erkindik Gallery",
      slug: "erkindik-gallery",
      category: { connect: { id: artCategory!.id } },
      description:
        "Modern art gallery with exhibitions by local artists.",
      address: "Abdrakhmanov St., Bishkek",
      lat: 42.878,
      lng: 74.595,
      photos: ["https://example.com/gallery.jpg"],
      priceRange: "free",
      rating: 4.2,
      openingHours: "11:00-19:00",
    },
    {
      name: "Burana",
      slug: "burana-tower",
      category: { connect: { id: historyCategory!.id } },
      description:
        "Historic minaret from the 10th-11th centuries near Tokmok. Open-air museum.",
      address: "Chuy Region, 80 km from Bishkek",
      lat: 42.7439,
      lng: 75.2439,
      photos: ["https://example.com/burana.jpg"],
      priceRange: "low",
      rating: 4.6,
      openingHours: "09:00-18:00",
    },
    {
      name: "Suusamyr",
      slug: "suusamyr-valley",
      category: { connect: { id: natureCategory!.id } },
      description:
        "High-mountain valley with panoramic views and fresh air.",
      address: "Suusamyr Valley",
      lat: 42.14,
      lng: 73.9,
      photos: ["https://example.com/suusamyr.jpg"],
      priceRange: "free",
      rating: 4.8,
    },
    {
      name: "Fairy Tale Canyon",
      slug: "fairy-tale-canyon",
      category: { connect: { id: natureCategory!.id } },
      description:
        "Colorful sandstone canyon on the south shore of Issyk-Kul.",
      address: "Issyk-Kul Region",
      lat: 42.1769,
      lng: 77.4092,
      photos: ["https://example.com/fairy-tale.jpg"],
      priceRange: "low",
      rating: 4.7,
    },
    {
      name: "Grigoryevskoe Gorge",
      slug: "grigoryevskoe-gorge",
      category: { connect: { id: natureCategory!.id } },
      description:
        "Picturesque gorge with conifers and mountain streams near Issyk-Kul.",
      address: "Issyk-Kul Region",
      lat: 42.6769,
      lng: 77.2506,
      photos: ["https://example.com/grigoryevskoe.jpg"],
      priceRange: "free",
      rating: 4.6,
    },
    {
      name: "Karakol",
      slug: "karakol-city",
      category: { connect: { id: historyCategory!.id } },
      description:
        "Cultural center of Issyk-Kul. Historic architecture and museums.",
      address: "Karakol City",
      lat: 42.4907,
      lng: 78.3936,
      photos: ["https://example.com/karakol.jpg"],
      priceRange: "medium",
      rating: 4.5,
    },
    {
      name: "Sary-Chelek",
      slug: "sary-chelek",
      category: { connect: { id: natureCategory!.id } },
      description: "Protected lake surrounded by mountains and forests.",
      address: "Jalal-Abad Region",
      lat: 41.86,
      lng: 72.02,
      photos: ["https://example.com/sary-chelek.jpg"],
      priceRange: "low",
      rating: 4.9,
    },
    {
      name: "Osh (Sulaiman-Too)",
      slug: "sulayman-too",
      category: { connect: { id: historyCategory!.id } },
      description:
        "Sacred mountain in Osh, UNESCO site and popular viewpoint.",
      address: "Osh City",
      lat: 40.5283,
      lng: 72.7985,
      photos: ["https://example.com/sulayman-too.jpg"],
      priceRange: "free",
      rating: 4.7,
    },
    {
      name: "TSUM Aichurek",
      slug: "tsum-aichurek",
      category: { connect: { id: shoppingCategory!.id } },
      description:
        "Large shopping center in the center of Bishkek.",
      address: "Chuy Ave., Bishkek",
      lat: 42.8756,
      lng: 74.6039,
      photos: ["https://example.com/tsum.jpg"],
      priceRange: "medium",
      rating: 4.2,
      openingHours: "10:00-22:00",
    },
    {
      name: "Botanical Garden",
      slug: "botanical-garden",
      category: { connect: { id: natureCategory!.id } },
      description:
        "Quiet place for walks and relaxation in Bishkek.",
      address: "Akhunbaev St., Bishkek",
      lat: 42.8536,
      lng: 74.6113,
      photos: ["https://example.com/botanical-garden.jpg"],
      priceRange: "low",
      rating: 4.3,
      openingHours: "09:00-20:00",
    },
    {
      name: "Opera and Ballet Theatre",
      slug: "opera-and-ballet-theatre",
      category: { connect: { id: artCategory!.id } },
      description:
        "National opera and ballet theatre with classic performances.",
      address: "Abdrakhmanov St., Bishkek",
      lat: 42.8752,
      lng: 74.6138,
      photos: ["https://example.com/opera.jpg"],
      priceRange: "medium",
      rating: 4.6,
      openingHours: "11:00-19:00",
    },
    {
      name: "Panfilov Park",
      slug: "panfilov-park",
      category: { connect: { id: shoppingCategory!.id } },
      description:
        "Popular city park with rides and alleys.",
      address: "Frunze St., Bishkek",
      lat: 42.874,
      lng: 74.5949,
      photos: ["https://example.com/panfilov-park.jpg"],
      priceRange: "low",
      rating: 4.4,
    },
  ];

  for (const place of places) {
    await prisma.place.upsert({
      where: { slug: place.slug },
      update: { ...place },
      create: place,
    });
  }

  console.log("✅ Places created");

  const insights = [
    {
      title: "Bargain at Osh Bazaar",
      content:
        "Prices are higher for tourists. Bargain and ask for 30-40% off. It's normal and expected.",
      category: "tip",
      placeId: (await prisma.place.findUnique({
        where: { slug: "osh-bazaar" },
      }))!.id,
    },
    {
      title: "Free entry to Ala-Archa before 8 AM",
      content:
        "If you arrive before 8 AM, entry is free. Fewer people and cooler weather too.",
      category: "secret",
      placeId: (await prisma.place.findUnique({
        where: { slug: "ala-archa" },
      }))!.id,
    },
    {
      title: "Navat has a secret menu",
      content:
        "Ask the waiter about the 'home dishes' - it's a secret menu with the most authentic dishes.",
      category: "secret",
      placeId: (await prisma.place.findUnique({ where: { slug: "navat" } }))!
        .id,
    },
    {
      title: "Don't take taxis at the station",
      content:
        "Station taxi drivers overcharge by 2-3x. Walk 200-300m and catch one there, or use a ride app.",
      category: "important",
    },
    {
      title: "Best time for Issyk-Kul",
      content:
        "July-August is peak season and crowded. Visit in June or September: warm water, fewer tourists, cheaper lodging.",
      category: "tip",
      placeId: (await prisma.place.findUnique({
        where: { slug: "issyk-kul" },
      }))!.id,
    },
  ];

  for (const insight of insights) {
    await prisma.insight.create({ data: insight });
  }

  console.log("✅ Insights created");

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
