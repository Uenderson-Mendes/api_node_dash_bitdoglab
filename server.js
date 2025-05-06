const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Configuração do MongoDB
const uri = "mongodb+srv://uemdersonbebe:ii7XY2hUp8cZ3lA7@cluster0.xbrrwkt.mongodb.net/meu_banco?retryWrites=true&w=majority";
mongoose.connect(uri)
  .then(() => console.log('Conectado ao MongoDB com sucesso!'))
  .catch(err => console.log('Erro ao conectar ao MongoDB:', err));

// Modelo do MongoDB
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
const Dado = mongoose.model('Dado', DadoSchema);

// Endpoint POST - Enviar dados para o MongoDB usando parâmetros na URL
app.post('/dados', async (req, res) => {
  try {
    // Pegando dados da query string
    const { temperatura, botao1, botao2, joystick_x, joystick_y, joystick_direcao } = req.query;

    // Criando o objeto de dados
    const dado = new Dado({
      temperatura,
      botao1,
      botao2,
      joystick: {
        x: joystick_x,
        y: joystick_y,
        direcao: joystick_direcao
      }
    });

    // Salvando no banco de dados
    await dado.save();
    res.status(201).send('Dado salvo com sucesso');
  } catch (err) {
    res.status(500).send('Erro ao salvar dado');
  }
});

// Iniciar o servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});


// Endpoint GET - Buscar dados com base em parâmetros de consulta
app.get('/dados', async (req, res) => {
    try {
      // Pegando parâmetros da query string
      const { temperatura, botao1, botao2, joystick_x, joystick_y, joystick_direcao } = req.query;
  
      // Construindo o objeto de filtro com base nos parâmetros fornecidos
      const filtro = {};
      if (temperatura) filtro.temperatura = temperatura;
      if (botao1) filtro.botao1 = botao1;
      if (botao2) filtro.botao2 = botao2;
      if (joystick_x) filtro['joystick.x'] = joystick_x;
      if (joystick_y) filtro['joystick.y'] = joystick_y;
      if (joystick_direcao) filtro['joystick.direcao'] = joystick_direcao;
  
      // Buscando os dados no banco de dados
      const dados = await Dado.find(filtro);
  
      // Verificando se foram encontrados dados
      if (dados.length > 0) {
        res.status(200).json(dados);
      } else {
        res.status(404).send('Nenhum dado encontrado com os parâmetros fornecidos');
      }
    } catch (err) {
      res.status(500).send('Erro ao buscar dados');
    }
  });
  