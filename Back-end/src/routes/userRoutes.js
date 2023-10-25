const express = require('express');
const userRoutes = express.Router();
const { PrismaClient, tipo_perfil } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const env = require('dotenv');

const prisma = new PrismaClient();

// Rota GET para obter todos os usuários
userRoutes.get('/usuariosGet', async (req, res) => {
  try {
    const users = await prisma.Usuarios.findMany();
    res.json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro ao buscar usuários.' });
  }
});

userRoutes.get('/buscaUsuarioId', async (req, res) => {
  const idusuario = parseInt(req.body.idusuario); 
  try {
    const usuario = await prisma.Usuarios.findUnique({
      where: {
        "idusuario": idusuario, 
      },
    });

    if (!usuario) {
      return res.status(404).json({ erro: 'Este usuário não existe!' });
    } else{
      return res.status(200).json({ usuario });
    }
    
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ erro: 'Erro ao buscar usuários.' });
  }
});

// Rota POST para criar um novo usuário
userRoutes.post('/usuariosPost', async (req, res) => {

  try {
    const { nome_funcionario, email, matricula, senha, tipo_perfil } = req.body;
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const newUser = await prisma.Usuarios.create({
      data: {
        nome_funcionario,
        email,
        matricula,
        senha: senhaCriptografada,
        tipo_perfil,
      },
    });
    res.json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar usuário.' });
  }

});

//apagar user pelo id
userRoutes.delete('/deletarUsuario', async (req, res) => {
  const idusuario = parseInt(req.body.idusuario);

  if (isNaN(idusuario)) {
    return res.status(400).json({ erro: 'ID de usuário inválido!' });
  }

  try {
    const deletedUsuario = await prisma.Usuarios.delete({ 
      where: {
        "idusuario": idusuario,
      },
    });

    if (!deletedUsuario) {
      return res.status(404).json({ erro: 'Este usuário não existe!' });
    }

    res.json({ mensagem: 'Usuário excluído com sucesso!' });

  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    res.status(500).json({ erro: 'Erro ao excluir usuário.' });
  }
});

//atualizar o nivel de acesso do usuário
userRoutes.put('/atualizarAcesso', async (req, res) => {
  const idusuario = parseInt(req.body.idusuario);
  const updateUser = await prisma.Usuarios.update({ 
    where: {
      "idusuario": idusuario
    },
    data: req.body
  });
  res.json(updateUser);  
});

//atualizar a senha
userRoutes.put('/atualizarSenha', async (req, res) => {
  const idusuario = parseInt(req.body.idusuario);
  const novaSenha = await bcrypt.hash(req.body.senha, 10);
  const updateUser = await prisma.Usuarios.update({ 
    where: {
      "idusuario": idusuario
    },
    data: {
      senha: novaSenha
    }
  });
  res.json(updateUser);  
});
  

//login
userRoutes.post('/login',async (req, res) => {
  
  const secretKey = 'QQ2023Tech5';
  const { matricula, senha } = req.body;
  console.log(env.DATABASE_URL)
  try { 
    const user = await prisma.Usuarios.findFirst({
      where: {
        "matricula": matricula,
      }
    })
   
    if (user) {

      const senhaValidada = await bcrypt.compare(senha, user.senha);

      if (senhaValidada === true) {
        req.session.usuario = user;

        const userData = {
          idusuario: user.idusuario,
          matricula: user.matricula,
          tipo_perfil: user.tipo_perfil,
        };

        const token = jwt.sign(userData, secretKey, { expiresIn: '1h' });

        res.json({
          token: token,
          nome_funcionario: user.nome_funcionario,
          idusuario: user.idusuario,
          matricula: user.matricula,
          tipo_perfil: user.tipo_perfil,

        })

      } else {
        res.status(401).json({ error: 'Credenciais inválidas.' });
      }
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao realizar login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

userRoutes.get('/logout', (req, res) => { 
  req.session.destroy((err) => {
    if (err) {
      console.error('Erro ao fazer logout:', err);
    } 
  });
});


module.exports = userRoutes;