import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Create categories
  await prisma.category.createMany({
    data: [
      {
        name: "Еда и кафе",
        slug: "food-cafes",
        icon: "🍽️",
        color: "#FF6B6B",
        description: "Рестораны, кафе, традиционная кухня",
      },
      {
        name: "История и культура",
        slug: "history-culture",
        icon: "🏛️",
        color: "#9B59B6",
        description: "Музеи, памятники, исторические места",
      },
      {
        name: "Природа и активности",
        slug: "nature-activities",
        icon: "🏔️",
        color: "#3498DB",
        description: "Горы, озера, треккинг, природные парки",
      },
      {
        name: "Шопинг и прогулки",
        slug: "shopping-walks",
        icon: "🛍️",
        color: "#F39C12",
        description: "Рынки, торговые центры, парки",
      },
      {
        name: "Искусство и креатив",
        slug: "art-creative",
        icon: "🎨",
        color: "#E91E63",
        description: "Галереи, арт-пространства, творческие места",
      },
      {
        name: "Вечерние развлечения",
        slug: "nightlife",
        icon: "🌃",
        color: "#34495E",
        description: "Бары, клубы, вечерние мероприятия",
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Categories created");

  // Get category IDs
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

  // Create places
  const places = [
    // Bishkek Food
    {
      name: "Навat",
      slug: "navat",
      categoryId: foodCategory!.id,
      description:
        "Традиционный ресторан с национальной кухней. Известен своим бешбармаком и лагманом.",
      address: "ул. Тоголок Молдо, Бишкек",
      lat: 42.8746,
      lng: 74.5698,
      photos: ["https://example.com/navat.jpg"],
      priceRange: "medium",
      rating: 4.7,
      openingHours: {
        monday: "10:00-23:00",
        tuesday: "10:00-23:00",
        wednesday: "10:00-23:00",
        thursday: "10:00-23:00",
        friday: "10:00-00:00",
        saturday: "10:00-00:00",
        sunday: "10:00-23:00",
      },
      tags: ["традиционная кухня", "бешбармак", "лагман"],
    },
    {
      name: "Coffeedelia",
      slug: "coffeedelia",
      categoryId: foodCategory!.id,
      description:
        "Уютная кофейня с отличным кофе и десертами. Популярна среди местных.",
      address: "пр. Чуй, Бишкек",
      lat: 42.8765,
      lng: 74.6033,
      photos: ["https://example.com/coffeedelia.jpg"],
      priceRange: "low",
      rating: 4.5,
      openingHours: {
        monday: "08:00-22:00",
        tuesday: "08:00-22:00",
        wednesday: "08:00-22:00",
        thursday: "08:00-22:00",
        friday: "08:00-23:00",
        saturday: "09:00-23:00",
        sunday: "09:00-22:00",
      },
      tags: ["кофе", "десерты", "wi-fi"],
    },

    // History & Culture
    {
      name: "Ала-Тоо площадь",
      slug: "ala-too-square",
      categoryId: historyCategory!.id,
      description:
        "Центральная площадь Бишкека. Место проведения парадов и мероприятий.",
      address: "пр. Чуй, Бишкек",
      lat: 42.8746,
      lng: 74.6066,
      photos: ["https://example.com/ala-too.jpg"],
      priceRange: "free",
      rating: 4.6,
      tags: ["площадь", "памятник", "фото"],
    },
    {
      name: "Государственный исторический музей",
      slug: "history-museum",
      categoryId: historyCategory!.id,
      description:
        "Главный исторический музей Кыргызстана с богатой коллекцией.",
      address: "пл. Ала-Тоо, Бишкек",
      lat: 42.8751,
      lng: 74.607,
      photos: ["https://example.com/museum.jpg"],
      priceRange: "low",
      rating: 4.4,
      openingHours: {
        monday: "Closed",
        tuesday: "09:00-17:00",
        wednesday: "09:00-17:00",
        thursday: "09:00-17:00",
        friday: "09:00-17:00",
        saturday: "09:00-17:00",
        sunday: "09:00-17:00",
      },
      tags: ["музей", "история", "культура"],
    },

    // Nature
    {
      name: "Ала-Арча",
      slug: "ala-archa",
      categoryId: natureCategory!.id,
      description:
        "Национальный парк в 40 км от Бишкека. Треккинг, пикники, красивые виды.",
      address: "Ала-Арчинский район",
      lat: 42.55,
      lng: 74.4833,
      photos: ["https://example.com/ala-archa.jpg"],
      priceRange: "low",
      rating: 4.9,
      tags: ["природа", "горы", "треккинг", "пикник"],
    },
    {
      name: "Иссык-Куль",
      slug: "issyk-kul",
      categoryId: natureCategory!.id,
      description:
        "Второе по величине высокогорное озеро в мире. Пляжи, санатории, чистый воздух.",
      address: "Иссык-Кульская область",
      lat: 42.4333,
      lng: 77.0833,
      photos: ["https://example.com/issyk-kul.jpg"],
      priceRange: "medium",
      rating: 5.0,
      tags: ["озеро", "пляж", "отдых", "природа"],
    },

    // Shopping
    {
      name: "Ошский базар",
      slug: "osh-bazaar",
      categoryId: shoppingCategory!.id,
      description:
        "Крупнейший рынок Бишкека. Фрукты, овощи, специи, одежда, сувениры.",
      address: "ул. Беишеналиевой, Бишкек",
      lat: 42.8691,
      lng: 74.5864,
      photos: ["https://example.com/osh-bazaar.jpg"],
      priceRange: "low",
      rating: 4.3,
      openingHours: {
        monday: "06:00-19:00",
        tuesday: "06:00-19:00",
        wednesday: "06:00-19:00",
        thursday: "06:00-19:00",
        friday: "06:00-19:00",
        saturday: "06:00-19:00",
        sunday: "06:00-19:00",
      },
      tags: ["рынок", "шопинг", "сувениры", "еда"],
    },
    {
      name: "Дубовый парк",
      slug: "oak-park",
      categoryId: shoppingCategory!.id,
      description: "Центральный парк Бишкека. Прогулки, аттракционы, кафе.",
      address: "пр. Эркиндик, Бишкек",
      lat: 42.8777,
      lng: 74.6122,
      photos: ["https://example.com/oak-park.jpg"],
      priceRange: "free",
      rating: 4.5,
      tags: ["парк", "прогулка", "отдых"],
    },

    // Art
    {
      name: "Галерея Эркиндик",
      slug: "erkindiк-gallery",
      categoryId: artCategory!.id,
      description:
        "Современная художественная галерея с выставками местных художников.",
      address: "ул. Абдрахманова, Бишкек",
      lat: 42.878,
      lng: 74.595,
      photos: ["https://example.com/gallery.jpg"],
      priceRange: "free",
      rating: 4.2,
      openingHours: {
        monday: "Closed",
        tuesday: "11:00-19:00",
        wednesday: "11:00-19:00",
        thursday: "11:00-19:00",
        friday: "11:00-19:00",
        saturday: "12:00-18:00",
        sunday: "12:00-18:00",
      },
      tags: ["галерея", "искусство", "выставки"],
    },
  ];

  for (const place of places) {
    await prisma.place.create({ data: place });
  }

  console.log("✅ Places created");

  // Create insights
  const insights = [
    {
      title: "Торгуйся на Ошском базаре",
      description:
        "Цены на рынке завышены для туристов. Торгуйся и сбивай 30-40%. Это нормально и ожидается!",
      category: "tip",
      placeId: (await prisma.place.findUnique({
        where: { slug: "osh-bazaar" },
      }))!.id,
    },
    {
      title: "Бесплатный вход в Ала-Арчу до 8 утра",
      description:
        "Если приедешь в национальный парк до 8 утра, вход будет бесплатным. Плюс меньше людей и прохладнее.",
      category: "secret",
      placeId: (await prisma.place.findUnique({
        where: { slug: "ala-archa" },
      }))!.id,
    },
    {
      title: "В Навате есть секретное меню",
      description:
        'Спроси у официанта про "домашние блюда" - это секретное меню с самыми вкусными и аутентичными блюдами.',
      category: "secret",
      placeId: (await prisma.place.findUnique({ where: { slug: "navat" } }))!
        .id,
    },
    {
      title: "Не бери такси у вокзала",
      description:
        "Таксисты у вокзала завышают цены в 2-3 раза. Отойди на 200-300м и лови там, или используй Яндекс.Такси.",
      category: "important",
    },
    {
      title: "Лучшее время для Иссык-Куля",
      description:
        "Июль-август - пик сезона и много людей. Приезжай в июне или сентябре: теплая вода, меньше туристов, дешевле жилье.",
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
