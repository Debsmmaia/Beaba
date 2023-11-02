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

camposRoutes.get('/buscaCampoId/:idcampo', async (req, res) => {
    const idcampo = parseInt(req.params.idcampo); 
    try {
      const campo = await prisma.Campos.findUnique({
        where: {
          "idcampo": idcampo, 
        },
      });
  
      if (!campo) {
        return res.status(404).json({ erro: 'Este campo não existe!' });
      } else{
        return res.status(200).json({ campo });
      }
      
    } catch (error) {
      console.error('Erro ao buscar campos:', error);
      res.status(500).json({ erro: 'Erro ao buscar campos.' });
    }
  });

module.exports = camposRoutes; 