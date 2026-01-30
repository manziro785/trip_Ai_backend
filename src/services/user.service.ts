import { prisma } from "../config/database";
import { AppError } from "../middleware/error.middleware";
import { UserPreferences } from "../types";

export class UserService {
  // Get user profile
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        preferences: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }

  // Update profile
  async updateProfile(
    userId: string,
    data: { name?: string; avatar?: string },
  ) {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
      },
    });

    return user;
  }

  // Update preferences
  async updatePreferences(userId: string, preferences: UserPreferences) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { preferences: preferences as any },
      select: {
        id: true,
        preferences: true,
      },
    });

    return user;
  }

  // Get user statistics
  async getUserStats(userId: string) {
    const [visitedCount, routesCount, wishlistCount] = await Promise.all([
      prisma.userPlaceInteraction.count({
        where: { userId, visited: true },
      }),
      prisma.route.count({
        where: { userId },
      }),
      prisma.userPlaceInteraction.count({
        where: { userId, wishlist: true },
      }),
    ]);

    // Calculate total travel days (mock for now)
    const routes = await prisma.route.findMany({
      where: { userId },
      select: { createdAt: true },
    });

    const uniqueDays = new Set(
      routes.map((r) => r.createdAt.toISOString().split("T")[0]),
    ).size;

    return {
      visitedPlaces: visitedCount,
      totalRoutes: routesCount,
      wishlistCount,
      travelDays: uniqueDays,
    };
  }

  // Get visit history
  async getVisitHistory(userId: string, limit: number = 20) {
    const history = await prisma.userPlaceInteraction.findMany({
      where: { userId, visited: true },
      include: {
        place: {
          select: {
            id: true,
            name: true,
            slug: true,
            photos: true,
            category: {
              select: {
                name: true,
                icon: true,
                color: true,
              },
            },
          },
        },
      },
      orderBy: { visitedAt: "desc" },
      take: limit,
    });

    return history;
  }

  // Mark place as visited
  async markPlaceVisited(userId: string, placeId: string) {
    const interaction = await prisma.userPlaceInteraction.upsert({
      where: {
        userId_placeId: { userId, placeId },
      },
      update: {
        visited: true,
        visitedAt: new Date(),
      },
      create: {
        userId,
        placeId,
        visited: true,
        visitedAt: new Date(),
      },
    });

    return interaction;
  }

  // Get wishlist
  async getWishlist(userId: string) {
    const wishlist = await prisma.userPlaceInteraction.findMany({
      where: { userId, wishlist: true },
      include: {
        place: {
          select: {
            id: true,
            name: true,
            slug: true,
            photos: true,
            description: true,
            category: {
              select: {
                name: true,
                icon: true,
                color: true,
              },
            },
          },
        },
      },
    });

    return wishlist.map((w) => w.place);
  }

  // Add to wishlist
  async addToWishlist(userId: string, placeId: string) {
    const interaction = await prisma.userPlaceInteraction.upsert({
      where: {
        userId_placeId: { userId, placeId },
      },
      update: {
        wishlist: true,
      },
      create: {
        userId,
        placeId,
        wishlist: true,
      },
    });

    return interaction;
  }

  // Remove from wishlist
  async removeFromWishlist(userId: string, placeId: string) {
    await prisma.userPlaceInteraction.update({
      where: {
        userId_placeId: { userId, placeId },
      },
      data: {
        wishlist: false,
      },
    });

    return { success: true };
  }

  // Like/Unlike place
  async toggleLike(userId: string, placeId: string) {
    const existing = await prisma.userPlaceInteraction.findUnique({
      where: {
        userId_placeId: { userId, placeId },
      },
    });

    const liked = !existing?.liked;

    const interaction = await prisma.userPlaceInteraction.upsert({
      where: {
        userId_placeId: { userId, placeId },
      },
      update: {
        liked,
      },
      create: {
        userId,
        placeId,
        liked,
      },
    });

    return { liked: interaction.liked };
  }
}
