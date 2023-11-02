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
    } else {
      return res.status(200).json({ campo });
    }

  } catch (error) {
    console.error('Erro ao buscar campos:', error);
    res.status(500).json({ erro: 'Erro ao buscar campos.' });
  }
});

camposRoutes.get('/buscaCampoeTemplateId/:idtemplate', async (req, res) => {
  const idtemplate = parseInt(req.params.idtemplate);
  try {
    const campos = await prisma.Campos.findMany({
      where: {
        "template_pertencente": idtemplate
      },
    });

    if (!campos || campos.length === 0) {
      return res.status(404).json({ erro: 'Não foram encontrados campos para este template!' });
    } else {
      return res.status(200).json({ campos });
    }
  } catch (error) {
    console.error('Erro ao buscar campos:', error);
    res.status(500).json({ erro: 'Erro ao buscar campos.' });
  }
});

const fastcsv = require('fast-csv');
const { createObjectCsvWriter } = require('csv-writer');

const fastcsv = require('fast-csv');
const { createObjectCsvWriter } = require('csv-writer');

camposRoutes.get('/buscaCampoeTemplateId/:idtemplate', async (req, res) => {
  const idtemplate = parseInt(req.params.idtemplate);
  try {
    const campos = await prisma.Campos.findMany({
      where: {
        "template_pertencente": idtemplate
      },
    });

    if (!campos || campos.length === 0) {
      return res.status(404).json({ erro: 'Não foram encontrados campos para este template!' });
    } else {
      const csvData = [];
      const csvHeaders = [];

      // Mapear os campos dinamicamente
      campos.forEach(campo => {
        // Verificar se a coluna já existe nos cabeçalhos
        if (!csvHeaders.includes(campo.nomeDaColuna)) {
          csvHeaders.push(campo.nomeDaColuna);
        }

        // Encontrar o índice da coluna
        const columnIndex = csvHeaders.indexOf(campo.nomeDaColuna);

        // Se a linha ainda não existe, criar e preencher com valores vazios
        if (!csvData[campo.id - 1]) {
          csvData[campo.id - 1] = Array(csvHeaders.length).fill('');
        }

        // Preencher o valor na linha e coluna correta
        csvData[campo.id - 1][columnIndex] = campo.valor;
      });

      // Criação do arquivo CSV
      const csvWriter = createObjectCsvWriter({
        path: 'arquivo.csv',
        header: csvHeaders.map(header => ({ id: header, title: header }))
      });

      await csvWriter.writeRecords(csvData);

      // Configuração do cabeçalho da resposta para indicar um arquivo CSV
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="arquivo.csv"');

      // Envio do arquivo CSV para download
      return res.download('arquivo.csv', 'arquivo.csv', (err) => {
        if (err) {
          console.error('Erro ao fazer o download do arquivo CSV:', err);
          res.status(500).json({ erro: 'Erro ao fazer o download do arquivo CSV.' });
        } else {
          // Remoção do arquivo após o download
          fs.unlinkSync('arquivo.csv');
        }
      });
    }
  } catch (error) {
    console.error('Erro ao buscar campos:', error);
    res.status(500).json({ erro: 'Erro ao buscar campos.' });
  }
});



module.exports = camposRoutes; 