/*
  Warnings:

  - You are about to drop the column `revoked` on the `Token` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Token" DROP COLUMN "revoked",
ADD COLUMN     "isRevoked" BOOLEAN NOT NULL DEFAULT false;
