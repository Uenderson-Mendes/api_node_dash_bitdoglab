const mongoose = require('mongoose');

const DadoSchema = new mongoose.Schema({
  temperatura: Number,
  botao1: String,
  botao2: String,
  joystick: {
    x: Number,
    y: Number,
    direcao: String
  },
  criado_em: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Dado', DadoSchema);
