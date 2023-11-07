const express = require('express');
const uploadRoutes = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

uploadRoutes.get('/uploadsGet', async (req, res) => {
    try {
      const uploads = await prisma.Uploads.findMany();
      res.json(uploads);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      res.status(500).json({ error: 'Erro ao buscar usuários.' });
    }
});

uploadRoutes.post('/adicionarUpload', async (req, res) => {
  try {
    const { caminho_arquivo, usuario, template_usado } = req.body;

    const newUpload = await prisma.Uploads.create({
      data: {
        "caminho_arquivo":caminho_arquivo,
        "usuario": parseInt(usuario),
        "template_usado": parseInt(template_usado),
      },
    });

    res.json({ message: 'Upload adicionado com sucesso ao banco de dados', data: newUpload });
  } catch (error) {
    console.error('Erro ao adicionar upload ao banco de dados:', error);
    res.status(500).json({ error: 'Erro ao adicionar upload ao banco de dados.' });
  }
});

module.exports = uploadRoutes;