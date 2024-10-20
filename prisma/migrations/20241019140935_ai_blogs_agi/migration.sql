/*
  Warnings:

  - You are about to drop the column `customDomain` on the `Site` table. All the data in the column will be lost.
  - Added the required column `description` to the `Site` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Site" DROP CONSTRAINT "Site_userId_fkey";

-- DropIndex
DROP INDEX "Site_customDomain_key";

-- AlterTable
ALTER TABLE "Site" DROP COLUMN "customDomain",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
