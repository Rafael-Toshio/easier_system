// controllers/chamadosController.js
const Chamado = require('../models/chamado');

exports.listarChamados = (req, res) => {
  Chamado.getAll((err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.criarChamado = (req, res) => {
  Chamado.create(req.body, (err, chamado) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json(chamado);
  });
};
