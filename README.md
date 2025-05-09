
# API Node - Dash BitDogLab

Esta é a API que serve dados para o painel **Dashboard Bit**. Ela foi construída usando **Node.js** e **Express**, com integração com o **MongoDB Atlas** para persistência dos dados. A API recebe dados do dispositivo (como o Raspberry Pi Pico W) e os armazena no banco de dados, que pode ser acessado pelo painel em tempo real.

## 🌐 Demonstração

A API está acessível em: [api-node-dash-bitdoglab.onrender.com](https://api-node-dash-bitdoglab.onrender.com)

## 🛠️ Tecnologias Utilizadas

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Mongoose](https://mongoosejs.com/)
- [Axios](https://axios-http.com/)

## 📁 Estrutura do Projeto

```

api\_node\_dash\_bitdoglab/
├── models/
│   └── Dados.js
├── routes/
│   └── dados.js
├── controllers/
│   └── dadosController.js
├── .env
├── server.js
├── package.json
└── README.md

````

## 🚀 Como Executar o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) instalado.
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) para banco de dados na nuvem (conta gratuita disponível).

### Passo a Passo

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/Uenderson-Mendes/api_node_dash_bitdoglab.git
   cd api_node_dash_bitdoglab


2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configuração do Banco de Dados (MongoDB Atlas):**

   * Crie uma conta no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
   * Crie um novo cluster no MongoDB Atlas.
   * Adicione um banco de dados chamado `bitdoglab` ou qualquer nome de sua escolha.
   * Obtenha a **string de conexão** do MongoDB (você encontrará essa opção no painel do Atlas).
   * No projeto, crie um arquivo `.env` e adicione a variável `MONGO_URI` com o valor da string de conexão do MongoDB.

     Exemplo de `.env`:

     ```env
     MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/bitdoglab?retryWrites=true&w=majority
     ```

4. **Inicie o servidor:**

   ```bash
   npm start
   ```

   A API estará rodando em `http://localhost:5000`.

5. **Testando a API:**

   * Você pode usar ferramentas como [Postman](https://www.postman.com/) ou `curl` para testar as rotas da API.
   * A API tem a rota `POST /dados`, que recebe os dados enviados e os armazena no MongoDB.

## 🔄 Como a API Funciona

### **Modelo de Dados:**

A API armazena os dados em um banco de dados MongoDB Atlas online. O modelo de dados é estruturado no arquivo `models/Dados.js`:

```js
const mongoose = require('mongoose');

const DadosSchema = new mongoose.Schema({
  temperatura: { type: Number, required: true },
  umidade: { type: Number, required: true },
  data: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Dados', DadosSchema);
```

### **Rota POST /dados**

Esta rota recebe dados de dispositivos (como o Raspberry Pi Pico W) e os armazena no banco de dados MongoDB Atlas. O código do controlador que lida com essa requisição está no arquivo `controllers/dadosController.js`:

```js
const Dados = require('../models/Dados');

exports.receberDados = (req, res) => {
  const { temperatura, umidade } = req.body;

  const novoDado = new Dados({
    temperatura,
    umidade,
  });

  novoDado.save()
    .then(() => res.status(201).send('Dados armazenados com sucesso!'))
    .catch(err => res.status(400).send('Erro ao salvar dados: ' + err));
};
```

Os dados enviados são salvos diretamente no **MongoDB Atlas**, permitindo fácil acesso e análise posterior.

## 📡 Integração com Dispositivos

Dispositivos como o **Raspberry Pi Pico W** podem enviar dados para esta API via **requisições HTTP POST** para a URL:

```
https://api-node-dash-bitdoglab.onrender.com/dados
```

Esses dados, como temperatura e umidade, são então armazenados no banco de dados **MongoDB Atlas**.

## 📚 Saiba Mais

* Documentação oficial do [Node.js](https://nodejs.org/en/docs/)
* Documentação do [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
* [Express](https://expressjs.com/)



