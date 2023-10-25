/*
  Warnings:

  - The values [Adm] on the enum `tipo_perfil` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "tipo_perfil_new" AS ENUM ('Administrador', 'Comum');
ALTER TABLE "Usuarios" ALTER COLUMN "tipo_perfil" TYPE "tipo_perfil_new" USING ("tipo_perfil"::text::"tipo_perfil_new");
ALTER TYPE "tipo_perfil" RENAME TO "tipo_perfil_old";
ALTER TYPE "tipo_perfil_new" RENAME TO "tipo_perfil";
DROP TYPE "tipo_perfil_old";
COMMIT;
