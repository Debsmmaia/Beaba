/*
  Warnings:

  - Added the required column `aprovacao` to the `Templates` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "aprovacao" AS ENUM ('Reprovado', 'Aprovado');

-- AlterTable
ALTER TABLE "Templates" ADD COLUMN     "aprovacao" "aprovacao" NOT NULL;
