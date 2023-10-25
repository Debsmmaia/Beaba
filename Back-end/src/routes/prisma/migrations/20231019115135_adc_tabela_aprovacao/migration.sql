/*
  Warnings:

  - The `aprovacao` column on the `Templates` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Templates" DROP COLUMN "aprovacao",
ADD COLUMN     "aprovacao" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "aprovacao";
