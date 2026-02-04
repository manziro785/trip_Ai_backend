/*
  Warnings:

  - You are about to drop the column `created_at` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `chat_messages` table. All the data in the column will be lost.
  - You are about to drop the column `route_id` on the `chat_messages` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `chat_messages` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `insights` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `insights` table. All the data in the column will be lost.
  - You are about to drop the column `helpful_count` on the `insights` table. All the data in the column will be lost.
  - You are about to drop the column `place_id` on the `insights` table. All the data in the column will be lost.
  - You are about to drop the column `audio_guide_url` on the `places` table. All the data in the column will be lost.
  - You are about to drop the column `category_id` on the `places` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `places` table. All the data in the column will be lost.
  - You are about to drop the column `opening_hours` on the `places` table. All the data in the column will be lost.
  - You are about to drop the column `price_range` on the `places` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `places` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `places` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `routes` table. All the data in the column will be lost.
  - You are about to drop the column `shared_token` on the `routes` table. All the data in the column will be lost.
  - You are about to drop the column `total_cost` on the `routes` table. All the data in the column will be lost.
  - You are about to drop the column `total_duration` on the `routes` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `routes` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `routes` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `user_place_interactions` table. All the data in the column will be lost.
  - You are about to drop the column `place_id` on the `user_place_interactions` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `user_place_interactions` table. All the data in the column will be lost.
  - You are about to drop the column `visited_at` on the `user_place_interactions` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `google_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `weather_cache` table. All the data in the column will be lost.
  - You are about to drop the column `expires_at` on the `weather_cache` table. All the data in the column will be lost.
  - You are about to drop the column `location_hash` on the `weather_cache` table. All the data in the column will be lost.
  - You are about to drop the `budget_tracking` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[sharedToken]` on the table `routes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,placeId]` on the table `user_place_interactions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[googleId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[locationHash]` on the table `weather_cache` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `chat_messages` table without a default value. This is not possible if the table is not empty.
  - Made the column `distance` on table `routes` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `placeId` to the `user_place_interactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `user_place_interactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiresAt` to the `weather_cache` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationHash` to the `weather_cache` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "budget_tracking" DROP CONSTRAINT "budget_tracking_route_id_fkey";

-- DropForeignKey
ALTER TABLE "budget_tracking" DROP CONSTRAINT "budget_tracking_user_id_fkey";

-- DropForeignKey
ALTER TABLE "chat_messages" DROP CONSTRAINT "chat_messages_route_id_fkey";

-- DropForeignKey
ALTER TABLE "chat_messages" DROP CONSTRAINT "chat_messages_user_id_fkey";

-- DropForeignKey
ALTER TABLE "insights" DROP CONSTRAINT "insights_place_id_fkey";

-- DropForeignKey
ALTER TABLE "places" DROP CONSTRAINT "places_category_id_fkey";

-- DropForeignKey
ALTER TABLE "routes" DROP CONSTRAINT "routes_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_place_interactions" DROP CONSTRAINT "user_place_interactions_place_id_fkey";

-- DropForeignKey
ALTER TABLE "user_place_interactions" DROP CONSTRAINT "user_place_interactions_user_id_fkey";

-- DropIndex
DROP INDEX "routes_shared_token_key";

-- DropIndex
DROP INDEX "user_place_interactions_user_id_place_id_key";

-- DropIndex
DROP INDEX "users_google_id_key";

-- DropIndex
DROP INDEX "weather_cache_location_hash_key";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "created_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ALTER COLUMN "icon" DROP NOT NULL,
ALTER COLUMN "color" DROP NOT NULL;

-- AlterTable
ALTER TABLE "chat_messages" DROP COLUMN "created_at",
DROP COLUMN "route_id",
DROP COLUMN "user_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "routeId" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "insights" DROP COLUMN "created_at",
DROP COLUMN "description",
DROP COLUMN "helpful_count",
DROP COLUMN "place_id",
ADD COLUMN     "content" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "helpfulCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "icon" TEXT,
ADD COLUMN     "placeId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "places" DROP COLUMN "audio_guide_url",
DROP COLUMN "category_id",
DROP COLUMN "created_at",
DROP COLUMN "opening_hours",
DROP COLUMN "price_range",
DROP COLUMN "tags",
DROP COLUMN "updated_at",
ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "openingHours" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "priceRange" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ADD COLUMN     "website" TEXT,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "photos" DROP DEFAULT;

-- AlterTable
ALTER TABLE "routes" DROP COLUMN "created_at",
DROP COLUMN "shared_token",
DROP COLUMN "total_cost",
DROP COLUMN "total_duration",
DROP COLUMN "updated_at",
DROP COLUMN "user_id",
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "currentPlace" INTEGER DEFAULT 0,
ADD COLUMN     "endTime" TEXT,
ADD COLUMN     "scheduledDate" TIMESTAMP(3),
ADD COLUMN     "scheduledTime" TEXT,
ADD COLUMN     "sharedToken" TEXT,
ADD COLUMN     "startedAt" TIMESTAMP(3),
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'SAVED',
ADD COLUMN     "totalCost" DOUBLE PRECISION,
ADD COLUMN     "totalDuration" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ADD COLUMN     "userId" TEXT,
ADD COLUMN     "visitedPlaces" JSONB,
ALTER COLUMN "distance" SET NOT NULL;

-- AlterTable
ALTER TABLE "user_place_interactions" DROP COLUMN "created_at",
DROP COLUMN "place_id",
DROP COLUMN "user_id",
DROP COLUMN "visited_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "placeId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "visitedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" DROP COLUMN "created_at",
DROP COLUMN "google_id",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "googleId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ALTER COLUMN "preferences" DROP DEFAULT;

-- AlterTable
ALTER TABLE "weather_cache" DROP COLUMN "created_at",
DROP COLUMN "expires_at",
DROP COLUMN "location_hash",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "locationHash" TEXT NOT NULL;

-- DropTable
DROP TABLE "budget_tracking";

-- CreateTable
CREATE TABLE "budget_trackings" (
    "id" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "plannedBudget" DOUBLE PRECISION NOT NULL,
    "spent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "expenses" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "budget_trackings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "budget_trackings_routeId_userId_key" ON "budget_trackings"("routeId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "routes_sharedToken_key" ON "routes"("sharedToken");

-- CreateIndex
CREATE UNIQUE INDEX "user_place_interactions_userId_placeId_key" ON "user_place_interactions"("userId", "placeId");

-- CreateIndex
CREATE UNIQUE INDEX "users_googleId_key" ON "users"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "weather_cache_locationHash_key" ON "weather_cache"("locationHash");

-- AddForeignKey
ALTER TABLE "places" ADD CONSTRAINT "places_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routes" ADD CONSTRAINT "routes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_place_interactions" ADD CONSTRAINT "user_place_interactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_place_interactions" ADD CONSTRAINT "user_place_interactions_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "places"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "routes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_trackings" ADD CONSTRAINT "budget_trackings_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "routes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_trackings" ADD CONSTRAINT "budget_trackings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insights" ADD CONSTRAINT "insights_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "places"("id") ON DELETE SET NULL ON UPDATE CASCADE;
