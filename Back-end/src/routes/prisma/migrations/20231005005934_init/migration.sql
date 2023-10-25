-- CreateEnum
CREATE TYPE "status_template" AS ENUM ('Ativo', 'Desativo');

-- CreateEnum
CREATE TYPE "tipo_perfil" AS ENUM ('Adm', 'Comum');

-- CreateTable
CREATE TABLE "Campos" (
    "idcampo" SERIAL NOT NULL,
    "nome_campo" VARCHAR(40) NOT NULL,
    "iipo_dado" VARCHAR(40) NOT NULL,
    "nulo" BOOLEAN,
    "template_pertencente" INTEGER NOT NULL,

    CONSTRAINT "campo_pkey" PRIMARY KEY ("idcampo")
);

-- CreateTable
CREATE TABLE "Templates" (
    "idtemplate" SERIAL NOT NULL,
    "nome_template" VARCHAR(40) NOT NULL,
    "tipo_arquivo" VARCHAR(10) NOT NULL,
    "data_criacao" TIMESTAMP(6) NOT NULL,
    "status" "status_template" NOT NULL,
    "usuario" INTEGER NOT NULL,

    CONSTRAINT "template_pkey" PRIMARY KEY ("idtemplate")
);

-- CreateTable
CREATE TABLE "Uploads" (
    "idupload" SERIAL NOT NULL,
    "caminho_arquivo" VARCHAR(40) NOT NULL,
    "data_criacao" TIMESTAMP(6) NOT NULL,
    "usuario" INTEGER NOT NULL,
    "template_usado" INTEGER NOT NULL,

    CONSTRAINT "upload_pkey" PRIMARY KEY ("idupload")
);

-- CreateTable
CREATE TABLE "Usuarios" (
    "nome_funcionario" VARCHAR(40) NOT NULL,
    "email" VARCHAR(40) NOT NULL,
    "matricula" INTEGER NOT NULL,
    "senha" VARCHAR(10) NOT NULL,
    "tipo_perfil" "tipo_perfil" NOT NULL,
    "idusuario" SERIAL NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("idusuario")
);

-- AddForeignKey
ALTER TABLE "Campos" ADD CONSTRAINT "template_pertencente_fkey" FOREIGN KEY ("template_pertencente") REFERENCES "Templates"("idtemplate") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Templates" ADD CONSTRAINT "usuario_fkey" FOREIGN KEY ("usuario") REFERENCES "Usuarios"("idusuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Uploads" ADD CONSTRAINT "template_fkey" FOREIGN KEY ("template_usado") REFERENCES "Templates"("idtemplate") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Uploads" ADD CONSTRAINT "usuarios_fkey" FOREIGN KEY ("usuario") REFERENCES "Usuarios"("idusuario") ON DELETE NO ACTION ON UPDATE NO ACTION;
