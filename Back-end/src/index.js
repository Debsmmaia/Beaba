const express = require('express');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const app = express();
app.use(express.json());

// Configuração da sessão
app.use(session({
  secret: 'QQ2023Tech5',
  saveUninitialized: true,
  resave: true,
  cookie: { maxAge: 10800000 }
}));

const corsOptions = {
  origin: 'http://127.0.0.1:5500',
  methods: 'GET, POST, PUT, DELETE',
  credentials: true,
};

app.use(cors(corsOptions));

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Servidor está escutando na porta ${PORT}`);
});

const usuarioRoutes = require('./routes/userRoutes');
const templateRoutes = require('./routes/templateRoutes');
const camposRoutes = require('./routes/camposRoutes');
const uploadsRoutes = require('./routes/uploadsRoutes');

app.use('/usuario', usuarioRoutes);
app.use('/template', templateRoutes);
app.use('/campos', camposRoutes);
app.use('/uploads', uploadsRoutes);
