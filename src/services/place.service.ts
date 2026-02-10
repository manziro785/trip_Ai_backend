import { prisma } from "../config/database";
import { AppError } from "../middleware/error.middleware";

export class PlaceService {
  async getPlaces(filters: {
    categoryId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { categoryId, search, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [places, total] = await Promise.all([
      prisma.place.findMany({
        where,
        include: {
          category: {
            select: {
              name: true,
              slug: true,
              icon: true,
              color: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { rating: "desc" },
      }),
      prisma.place.count({ where }),
    ]);

    return {
      places,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getPlaceById(placeId: string, userId?: string) {
    const place = await prisma.place.findUnique({
      where: { id: placeId },
      include: {
        category: true,
        insights: {
          orderBy: { helpfulCount: "desc" },
          take: 5,
        },
      },
    });

    if (!place) {
      throw new AppError("Place not found", 404);
    }

    let userInteraction = null;
    if (userId) {
      userInteraction = await prisma.userPlaceInteraction.findUnique({
        where: {
          userId_placeId: { userId, placeId },
        },
      });
    }

    return {
      ...place,
      userInteraction: userInteraction
        ? {
            visited: userInteraction.visited,
            liked: userInteraction.liked,
            wishlist: userInteraction.wishlist,
          }
        : null,
    };
  }

  async getNearbyPlaces(lat: number, lng: number, radius: number = 5) {
    const latDelta = radius / 111;
    const lngDelta = radius / (111 * Math.cos((lat * Math.PI) / 180));

    const places = await prisma.place.findMany({
      where: {
        lat: {
          gte: lat - latDelta,
          lte: lat + latDelta,
        },
        lng: {
          gte: lng - lngDelta,
          lte: lng + lngDelta,
        },
      },
      include: {
        category: true,
      },
      take: 50,
    });

    const placesWithDistance = places.map((place) => {
      const distance = this.calculateDistance(lat, lng, place.lat, place.lng);
      return { ...place, distance };
    });

    return placesWithDistance
      .filter((p) => p.distance <= radius)
      .sort((a, b) => a.distance - b.distance);
  }

  async getCategories() {
    return await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}
