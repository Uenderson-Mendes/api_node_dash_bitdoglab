const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');  // Importando o pacote cors

const app = express();

// Lista de origens permitidas (adicione sua URL de produção aqui se tiver)
const allowedOrigins = [
  'http://localhost:3000', // React local
  'https://meu-front.vercel.app' // Substitua pela URL real do seu front
];

// Configuração do CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(bodyParser.json());  // Para parsear os dados do corpo da requisição

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
    default: Date.now,
  }
});
const Dado = mongoose.model('Dado', DadoSchema);

// Endpoint POST - Enviar dados para o MongoDB
app.post('/dados', async (req, res) => {
  try {
    const { temperatura, botao1, botao2, joystick } = req.body;

    const dado = new Dado({
      temperatura,
      botao1,
      botao2,
      joystick: {
        x: joystick.x,
        y: joystick.y,
        direcao: joystick.direcao
      }
    });

    await dado.save();
    res.status(201).send('Dado salvo com sucesso');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao salvar dado');
  }
});

// Endpoint GET - Buscar dados com base em parâmetros de consulta
app.get('/dados', async (req, res) => {
  try {
    const { temperatura, botao1, botao2, joystick_x, joystick_y, joystick_direcao } = req.query;

    const filtro = {};
    if (temperatura) filtro.temperatura = temperatura;
    if (botao1) filtro.botao1 = botao1;
    if (botao2) filtro.botao2 = botao2;
    if (joystick_x) filtro['joystick.x'] = joystick_x;
    if (joystick_y) filtro['joystick.y'] = joystick_y;
    if (joystick_direcao) filtro['joystick.direcao'] = joystick_direcao;

    const dados = await Dado.find(filtro);

    if (dados.length > 0) {
      res.status(200).json(dados);
    } else {
      res.status(404).send('Nenhum dado encontrado com os parâmetros fornecidos');
    }
  } catch (err) {
    res.status(500).send('Erro ao buscar dados');
  }
});

// Iniciar o servidor
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
