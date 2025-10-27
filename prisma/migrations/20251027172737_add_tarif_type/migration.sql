/*
  Warnings:

  - You are about to drop the column `subsEnd` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Tafif" AS ENUM ('FREE', 'STANDART', 'FLEX');

-- AlterTable
ALTER TABLE "SubscriptionPlan" ADD COLUMN     "type" "Tafif" NOT NULL DEFAULT 'STANDART';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "subsEnd";
