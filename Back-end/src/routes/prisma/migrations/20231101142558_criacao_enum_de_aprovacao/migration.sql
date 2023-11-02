/*
  Warnings:

  - The values [Pendente] on the enum `status_template` will be removed. If these variants are still used in the database, this will fail.
  - The `aprovacao` column on the `Templates` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "aprovacao" AS ENUM ('Aprovado', 'Reprovado', 'Pendente');

-- AlterEnum
BEGIN;
CREATE TYPE "status_template_new" AS ENUM ('Ativo', 'Desativo');
ALTER TABLE "Templates" ALTER COLUMN "status" TYPE "status_template_new" USING ("status"::text::"status_template_new");
ALTER TYPE "status_template" RENAME TO "status_template_old";
ALTER TYPE "status_template_new" RENAME TO "status_template";
DROP TYPE "status_template_old";
COMMIT;

-- AlterTable
ALTER TABLE "Templates" DROP COLUMN "aprovacao",
ADD COLUMN     "aprovacao" "aprovacao" NOT NULL DEFAULT 'Pendente';
