/*
  Warnings:

  - The primary key for the `Token` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `hashedToken` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `isRevoked` on the `Token` table. All the data in the column will be lost.
  - The `id` column on the `Token` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `expirationTime` to the `Token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Token_id_key";

-- AlterTable
ALTER TABLE "Token" DROP CONSTRAINT "Token_pkey",
DROP COLUMN "hashedToken",
DROP COLUMN "isRevoked",
ADD COLUMN     "expirationTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "token" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Token_pkey" PRIMARY KEY ("id");
