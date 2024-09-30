const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

// Configurar o destino para os arquivos enviados
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Nomeia os arquivos com a data atual + extensão original
  }
});

const upload = multer({ storage: storage });

// Servir a página de upload
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Rota para lidar com o upload de arquivos
app.post('/upload', upload.single('file'), (req, res) => {
  res.send('Arquivo enviado com sucesso!');
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
