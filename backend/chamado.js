// models/chamado.js
const db = require('../../../backend/config/database');

const Chamado = {
  getAll: (callback) => {
    db.all('SELECT * FROM chamados ORDER BY criado_em DESC', [], callback);
  },
  create: (data, callback) => {
    const { titulo, descricao, marca, modelo, placa } = data;
    db.run(
      'INSERT INTO chamados (titulo, descricao, marca, modelo, placa) VALUES (?, ?, ?, ?, ?)',
      [titulo, descricao, marca, modelo, placa],
      function (err) {
        callback(err, { id: this.lastID, ...data });
      }
    );
  },
};

module.exports = Chamado;
