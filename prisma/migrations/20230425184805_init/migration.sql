/*
  Warnings:

  - You are about to alter the column `geocode` on the `Event` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "geocode" SET DATA TYPE DOUBLE PRECISION[];
