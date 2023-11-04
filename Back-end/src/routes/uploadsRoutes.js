const express = require('express');
const uploadsRoutes = express.Router();
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const oAuth2Client = new OAuth2Client({
  clientId: '362746920858-rp1rs9ectsblbjtg8ed5fr3jfssul0ae.apps.googleusercontent.com',
  clientSecret: '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',
  redirectUri: 'http://localhost', // Seu URI autorizado
});

uploadsRoutes.post('/adicionar-arquivo', async (req, res) => {
  const file = req.body.file; // Arquivo a ser salvo no banco de dados e enviado ao Google Drive
  const codigoDeAutorizacao = req.body.token; // Código de autorização enviado do front-end

  try {
    // Lógica para autenticar com o Google
    const { tokens } = await oAuth2Client.getToken(codigoDeAutorizacao);
    oAuth2Client.setCredentials(tokens);

    // Lógica para interagir com a API do Google Drive
    const drive = google.drive({ version: 'v3', auth: oAuth2Client });
    const fileMetadata = {
      'name': 'arquivo.txt'
    };
    const media = {
      mimeType: 'text/plain',
      body: file,
    };

    // Upload do arquivo para o Google Drive
    const responseDrive = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id'
    });

    // Obter o link de visualização do arquivo no Google Drive
    const fileId = responseDrive.data.id;
    const fileMetadataDrive = await drive.files.get({
      fileId: fileId,
      fields: 'webViewLink' // Isso irá retornar o link de visualização do arquivo
    });
    const linkArquivoDrive = fileMetadataDrive.data.webViewLink;

    const { usuario, template_usado } = req.body;

    // Lógica para adicionar a referência do arquivo ao banco de dados, incluindo o link obtido
    const newUpload = await prisma.Campos.create({
      data: {
        caminho_arquivo: linkArquivoDrive,
        usuario: parseInt(usuario),
        template_usado: parseInt(template_usado),
      },
    });

    // Retorna a resposta para o front-end indicando o sucesso
    res.status(200).send('Arquivo salvo no banco de dados e no Google Drive com sucesso!');
  } catch (error) {
    console.error('Erro ao realizar o upload:', error);
    res.status(500).send('Ocorreu um erro ao enviar o arquivo para o Google Drive');
  }
});

module.exports = uploadsRoutes;