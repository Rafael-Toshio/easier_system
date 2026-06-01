const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {

  res.json([
    {
      id: 1,
      titulo: 'Problema no ar-condicionado',
      status: 'aberto'
    }
  ]);

});

router.post('/', (req, res) => {

  console.log(req.body);

  res.json({
    sucesso: true,
    mensagem: 'Chamado aberto com sucesso'
  });

});

module.exports = router;