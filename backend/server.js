require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('./config/database');
const chamadosRoutes = require('./routes/chamados');

const app = express();

const PORT = process.env.PORT || 3001;
const JWT_SECRET =
  process.env.JWT_SECRET || 'easier_secret_key_2024';

// MIDDLEWARES
app.use(cors());
app.use(express.json());

// ================================
// LOGIN
// ================================
app.post('/api/login', async (req, res) => {

  const { email, senha, tipo } = req.body;

  if (!email || !senha || !tipo) {
    return res.status(400).json({
      erro: 'Email, senha e tipo são obrigatórios.'
    });
  }

  try {

    const tabela =
      tipo === 'funcionario'
        ? 'funcionarios'
        : 'clientes';

    const [rows] = await db.query(
      `SELECT * FROM ${tabela} WHERE email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        erro: 'Credenciais inválidas.'
      });
    }

    const usuario = rows[0];

    const senhaValida = await bcrypt.compare(
      senha,
      usuario.senha
    );

    if (!senhaValida) {
      return res.status(401).json({
        erro: 'Credenciais inválidas.'
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        tipo
      },
      JWT_SECRET,
      {
        expiresIn: '8h'
      }
    );

    res.json({
      mensagem: 'Login realizado com sucesso.',
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo
      }
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      erro: 'Erro interno do servidor.'
    });

  }

});

// ================================
// CADASTRO CLIENTE
// ================================
app.post('/api/cadastro/cliente', async (req, res) => {

  const {
    nome,
    email,
    senha,
    telefone,
    cpf
  } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({
      erro: 'Nome, email e senha são obrigatórios.'
    });
  }

  try {

    const [existing] = await db.query(
      'SELECT id FROM clientes WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        erro: 'Email já cadastrado.'
      });
    }

    const hash = await bcrypt.hash(senha, 10);

    await db.query(
      `
      INSERT INTO clientes
      (nome, email, senha, telefone, cpf)
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        nome,
        email,
        hash,
        telefone || null,
        cpf || null
      ]
    );

    res.status(201).json({
      mensagem: 'Cliente cadastrado com sucesso.'
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      erro: 'Erro interno do servidor.'
    });

  }

});

// ================================
// CADASTRO FUNCIONÁRIO
// ================================
app.post('/api/cadastro/funcionario', async (req, res) => {

  const {
    nome,
    email,
    senha,
    telefone,
    cpf,
    cargo
  } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({
      erro: 'Nome, email e senha são obrigatórios.'
    });
  }

  try {

    const [existing] = await db.query(
      'SELECT id FROM funcionarios WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        erro: 'Email já cadastrado.'
      });
    }

    const hash = await bcrypt.hash(senha, 10);

    await db.query(
      `
      INSERT INTO funcionarios
      (nome, email, senha, telefone, cpf, cargo)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        nome,
        email,
        hash,
        telefone || null,
        cpf || null,
        cargo || null
      ]
    );

    res.status(201).json({
      mensagem: 'Funcionário cadastrado com sucesso.'
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      erro: 'Erro interno do servidor.'
    });

  }

});

// ================================
// ROTAS DOS CHAMADOS
// ================================
app.use('/api/chamados', chamadosRoutes);

// ================================
// HEALTH CHECK
// ================================
app.get('/api/health', (req, res) => {

  res.json({
    status: 'ok',
    sistema: 'EASIER'
  });

});

// ================================
// START SERVER
// ================================
app.listen(PORT, () => {

  console.log(
    `🚀 Servidor EASIER rodando na porta ${PORT}`
  );

});