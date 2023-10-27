const express = require('express');
const templateRoutes = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

templateRoutes.get('/templateGet', async (req, res) => {
    try {
      const templates = await prisma.Templates.findMany();
      res.json(templates);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      res.status(500).json({ error: 'Erro ao buscar usuários.' });
    }
});

templateRoutes.post('/templatePost', async (req, res) => {
    const { nome_template, tipo_arquivo, data_criacao, status, usuario } = req.body;
    try {
        const newTemplate = await prisma.Templates.create({
            data: {
                  nome_template,
                  tipo_arquivo,
                  status,
                  usuario: parseInt(usuario),
            },
        });
        res.json(newTemplate);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar template.' });
    }
});

templateRoutes.get('/buscaTemplateId/:idtemplate', async (req, res) => {
  const idtemplate = parseInt(req.params.idtemplate); 
  try {
    const template = await prisma.Templates.findUnique({
      where: {
        "idtemplate": idtemplate, 
      },
    });

    if (!template) {
      return res.status(404).json({ erro: 'Este usuário não existe!' });
    }

    res.json(template);
    
  } catch (error) {
    console.error('Erro ao buscar template:', error);
    res.status(500).json({ erro: 'Erro ao buscar template.' });
  }
});

templateRoutes.put('/aprovarTemplate', async (req, res) => {
  const idtemplate = parseInt(req.body.idtemplate);
  const templateAp = await prisma.Templates.update({ 
    where: {
      "idtemplate": idtemplate,
    },
    data: req.body
  });
  res.json(templateAp);  
});


// templateRoutes.delete('/deletarTemplate/:idtemplate', async (req, res) => {
//   const idtemplate = parseInt(req.params.idtemplate);

//   try {
//     const deletedTemplate = await prisma.Templates.delete({ 
//       where: {
//         "idtemplate": idtemplate,
//       },
//     });

//     if (!deletedTemplate) {
//       return res.status(404).json({ erro: 'Template não existe!' });
//     }

//     res.json({ mensagem: 'Template excluído com sucesso!' });

//   } catch (error) {
//     console.error('Erro ao excluir template:', error);
//     res.status(500).json({ erro: 'Erro ao excluir template"' });
//   }
// });




module.exports = templateRoutes;