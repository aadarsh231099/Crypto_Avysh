// Fixed Crypto_Avysh server.js with in-memory file handling and no fs dependencies
const express = require('express');
const multer = require('multer');
const imageToBase64 = require('image-to-base64');
const NodeRSA = require('node-rsa');
const bodyparser = require('body-parser');
const crypto = require('crypto');
const Encryption = require('node_triple_des');
const pdf2base64 = require('pdf-to-base64');
const { decode } = require('node-base64-image');

const app = express();
const key = new NodeRSA({ b: 1024 });
const algorithm = 'aes-256-cbc';
const initVector = crypto.randomBytes(16);
const Securitykey = crypto.randomBytes(32);
const PORT = process.env.PORT || 5000;

// Memory storage for multer
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('file');

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/start.html');
});

app.get('/index', (req, res) => {
  res.render('index');
});

app.get('/index1', (req, res) => {
  res.render('index1');
});

app.get('/index2', (req, res) => {
  res.render('index2');
});

// Text encryption
app.post('/encrypt', (req, res) => {
  const { text, type } = req.body;
  let encryptedString = '';

  switch (type) {
    case 'rsa':
      encryptedString = key.encrypt(text, 'base64');
      break;
    case 'tdes':
      encryptedString = Encryption.encrypt('SharedKey', text);
      break;
    case 'aes':
      const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
      encryptedString = cipher.update(text, 'utf-8', 'hex') + cipher.final('hex');
      break;
    default:
      encryptedString = 'Invalid encryption type';
  }

  res.send(encryptedString);
});

// Text decryption
app.post('/decrypt', (req, res) => {
  const { text, type } = req.body;
  let decryptedString = '';

  try {
    switch (type) {
      case 'rsa':
        decryptedString = key.decrypt(text, 'utf-8');
        break;
      case 'tdes':
        decryptedString = Encryption.decrypt('SharedKey', text);
        break;
      case 'aes':
        const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);
        decryptedString = decipher.update(text, 'hex', 'utf-8') + decipher.final('utf8');
        break;
      default:
        decryptedString = 'Invalid decryption type';
    }
    res.send(decryptedString);
  } catch (err) {
    res.status(500).send('Decryption failed');
  }
});

// Image encryption
app.post('/encode', upload, async (req, res) => {
  try {
    const buffer = req.file.buffer;
    const base64 = buffer.toString('base64');
    const encrypted = Encryption.encrypt('SharedKey', base64);
    res.setHeader('Content-Disposition', 'attachment; filename="encrypted.txt"');
    res.setHeader('Content-Type', 'text/plain');
    res.send(encrypted);
  } catch (err) {
    res.status(500).send('Image encryption failed');
  }
});

// Image decryption
app.post('/decode', upload, async (req, res) => {
  try {
    const base64Encoded = req.file.buffer.toString('utf-8');
    const decodedBase64 = Encryption.decrypt('SharedKey', base64Encoded);
    const imgBuffer = Buffer.from(decodedBase64, 'base64');
    res.setHeader('Content-Disposition', 'attachment; filename="decrypted.jpg"');
    res.setHeader('Content-Type', 'image/jpeg');
    res.end(imgBuffer);
  } catch (err) {
    res.status(500).send('Image decryption failed');
  }
});

// File encryption (PDF)
app.post('/encode1', upload, async (req, res) => {
  try {
    const base64 = req.file.buffer.toString('base64');
    const encrypted = key.encrypt(base64, 'base64');
    res.setHeader('Content-Disposition', 'attachment; filename="encrypted.txt"');
    res.setHeader('Content-Type', 'text/plain');
    res.send(encrypted);
  } catch (err) {
    res.status(500).send('File encryption failed');
  }
});

// File decryption (PDF)
app.post('/decode1', upload, async (req, res) => {
  try {
    const encryptedBase64 = req.file.buffer.toString('utf-8');
    const decrypted = key.decrypt(encryptedBase64, 'utf-8');
    const pdfBuffer = Buffer.from(decrypted, 'base64');
    res.setHeader('Content-Disposition', 'attachment; filename="decrypted.pdf"');
    res.setHeader('Content-Type', 'application/pdf');
    res.end(pdfBuffer);
  } catch (err) {
    res.status(500).send('File decryption failed');
  }
});

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
