/*
  Warnings:

  - You are about to drop the column `type` on the `SubscriptionPlan` table. All the data in the column will be lost.
  - Added the required column `label` to the `SubscriptionPlan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubscriptionPlan" DROP COLUMN "type",
ADD COLUMN     "label" TEXT NOT NULL;

-- DropEnum
DROP TYPE "public"."Tafif";
