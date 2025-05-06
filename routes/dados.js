const express = require('express');
const router = express.Router();
const Dado = require('../models/Dado');

// POST - Receber dados do cliente (C, Pico etc.)
router.post('/', async (req, res) => {
  try {
    const dado = new Dado(req.body);
    await dado.save();
    res.status(201).json({ message: 'Dados salvos com sucesso' });
  } catch (err) {
    res.status(400).json({ error: 'Erro ao salvar os dados', details: err });
  }
});

// GET - Listar todos os dados recebidos
router.get('/', async (req, res) => {
  try {
    const dados = await Dado.find().sort({ criado_em: -1 });
    res.json(dados);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar dados' });
  }
});

module.exports = router;
