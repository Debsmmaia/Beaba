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

module.exports = uploadRoutes;