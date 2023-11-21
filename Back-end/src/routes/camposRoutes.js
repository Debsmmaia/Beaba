const fastcsv = require('fast-csv');
const { createObjectCsvWriter } = require('csv-writer');
const fs = require('fs');
const excelJS = require('exceljs');
const excel4node = require('excel4node');
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

// camposRoutes.get('/buscaCampoeTemplateId/:idtemplate', async (req, res) => {
//   const idtemplate = parseInt(req.params.idtemplate);
//   try {
//     const campos = await prisma.Campos.findMany({
//       where: {
//         "template_pertencente": idtemplate
//       },
//     });

//     if (!campos || campos.length === 0) {
//       return res.status(404).json({ erro: 'Não foram encontrados campos para este template!' });
//     } else {
//       return res.status(200).json({ campos });
//     }
//   } catch (error) {
//     console.error('Erro ao buscar campos:', error);
//     res.status(500).json({ erro: 'Erro ao buscar campos.' });
//   }
// });




camposRoutes.get('/templateCSV/:idtemplate', async (req, res) => {
  const idtemplate = parseInt(req.params.idtemplate);
  try {
    const campos = await prisma.campos.findMany({
      where: {
        "template_pertencente": idtemplate
      },
    });

    if (!campos || campos.length === 0) {
      return res.status(404).json({ erro: 'Não foram encontrados campos para este template!' });
    } else {
      let csvData = '';

      campos.forEach(campo => {
        csvData += campo.nome_campo + ','; //itera os valores contidos na requisição
      });

      const filePath = 'arquivo.csv';
      fs.writeFileSync(filePath, csvData); //coloca os dados dos nomes no arquivo temporário
      const fileStream = fs.createReadStream(filePath);  //cria um fluxo de leitura pro arquivo 
      fileStream.pipe(res);  //envia o arquivo csv como resposta 
      fileStream.on('end', () => { //remove o arquivo depois de enviar
        fs.unlinkSync(filePath);
      });
    }
  } catch (error) {
    console.error('Erro ao buscar campos:', error);
    res.status(500).json({ erro: 'Erro ao buscar campos.' });
  }
});


camposRoutes.get('/templateXLX/:idtemplate', async (req, res) => {
  const idtemplate = parseInt(req.params.idtemplate);

  try {
    const campos = await prisma.campos.findMany({
      where: {
        "template_pertencente": idtemplate
      },
    });

    if (!campos || campos.length === 0) {
      return res.status(404).json({ erro: 'Não foram encontrados campos para este template!' });
    } else {
      const workbook = new excel4node.Workbook();
      const worksheet = workbook.addWorksheet('Campos');

      campos.forEach((campo, index) => {
        worksheet.cell(1, index + 1).string(campo.nome_campo); // Adiciona cada campo como uma nova coluna
      })

      const filePath = 'arquivo.xlsx'; 

      workbook.write(filePath, err => {
        if (err) {
          console.error('Erro ao escrever o arquivo XLS:', err);
          return res.status(500).json({ erro: 'Erro ao salvar o arquivo XLS.' });
        }

        // Envio do arquivo XLS como resposta
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

        // Remoção do arquivo após o envio
        fileStream.on('end', () => {
          fs.unlinkSync(filePath);
        });
      });
    }
  } catch (error) {
    console.error('Erro ao buscar campos:', error);
    res.status(500).json({ erro: 'Erro ao buscar campos.' });
  }
});


camposRoutes.get('/templateXLS/:idtemplate', async (req, res) => {
  const idtemplate = parseInt(req.params.idtemplate);

  try {
    const campos = await prisma.campos.findMany({
      where: {
        "template_pertencente": idtemplate
      },
    });

    if (!campos || campos.length === 0) {
      return res.status(404).json({ erro: 'Não foram encontrados campos para este template!' });
    } else {
      const workbook = new excel4node.Workbook();
      const worksheet = workbook.addWorksheet('Campos');

      campos.forEach((campo, index) => {
        worksheet.cell(1, index + 1).string(campo.nome_campo); 
      })

      const filePath = 'arquivo.xls'; 
      workbook.write(filePath, err => {
        if (err) {
          console.error('Erro ao escrever o arquivo XLS:', err);
          return res.status(500).json({ erro: 'Erro ao salvar o arquivo XLS.' });
        }

        // Envio do arquivo XLS como resposta
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

        // Remoção do arquivo após o envio
        fileStream.on('end', () => {
          fs.unlinkSync(filePath);
        });
      });
    }
  } catch (error) {
    console.error('Erro ao buscar campos:', error);
    res.status(500).json({ erro: 'Erro ao buscar campos.' });
  }
});


module.exports = camposRoutes; 