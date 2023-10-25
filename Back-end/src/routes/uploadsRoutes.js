const express = require('express');
const uploadsRoutes = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

uploadsRoutes.post('/uploadsPost', async (req, res) => {
    const { caminho_arquivo, data_criacao, usuario, template_usado } = req.body;
    try {
        const newUpload = await prisma.Campos.create({
            data: {
                caminho_arquivo,
                data_criacao: new Date(data_criacao),
                usuario: parseInt(usuario),
                template_usado: parseInt(template_usado),
            },
        });
        res.json(newUpload);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Erro ao postar upload.' });
    }
});

module.exports = uploadsRoutes;