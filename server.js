const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

// Permitir servir arquivos estáticos (como as imagens enviadas)
app.use('/uploads', express.static('uploads'));

// Configurar o destino para os arquivos enviados
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Salva na pasta 'uploads'
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Nomeia o arquivo com a data atual
  }
});

const upload = multer({ storage: storage });

// Servir a página de upload
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Rota para lidar com o upload de imagens
app.post('/upload', upload.single('file'), (req, res) => {
  // Responde com o link da imagem enviada
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ fileUrl: fileUrl });
});

// Rota para retornar todas as imagens
app.get('/images', (req, res) => {
  fs.readdir('uploads/', (err, files) => {
    if (err) {
      return res.status(500).send('Erro ao ler as imagens');
    }
    const fileUrls = files.map(file => `/uploads/${file}`);
    res.json(fileUrls);
  });
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
