-- AlterTable
ALTER TABLE "User" ADD COLUMN     "username" TEXT NOT NULL DEFAULT 'default_username',
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
