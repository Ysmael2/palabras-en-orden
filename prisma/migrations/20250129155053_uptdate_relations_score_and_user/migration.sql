/*
  Warnings:

  - You are about to drop the column `userId` on the `Score` table. All the data in the column will be lost.
  - Added the required column `emailUser` to the `Score` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Score" DROP CONSTRAINT "Score_userId_fkey";

-- AlterTable
ALTER TABLE "Score" DROP COLUMN "userId",
ADD COLUMN     "emailUser" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_emailUser_fkey" FOREIGN KEY ("emailUser") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
