/*
  Warnings:

  - You are about to drop the column `iipo_dado` on the `Campos` table. All the data in the column will be lost.
  - Added the required column `tipo_dado` to the `Campos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Campos" DROP COLUMN "iipo_dado",
ADD COLUMN     "tipo_dado" VARCHAR(40) NOT NULL;

-- AlterTable
ALTER TABLE "Usuarios" ALTER COLUMN "matricula" SET DATA TYPE VARCHAR(40);
