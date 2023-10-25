const express = require('express');
const camposRoutes = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

camposRoutes.post('/camposPost', async (req, res) => {
    const { nome_campo, tipo_dado, nulo, template_pertencente } = req.body;
    try {
        const newCampos = await prisma.Campos.create({
            data: {
                  nome_campo,
                  tipo_dado,
                  nulo,
                  template_pertencente,
            },
        });
        res.json(newCampos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Erro ao criar campo.' });
    }
});

module.exports = camposRoutes; 