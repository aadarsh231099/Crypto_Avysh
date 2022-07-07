const express=require('express');
const app=express();
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
const crypto = require('crypto');
const algorithm = "aes-256-cbc"; 
const initVector = crypto.randomBytes(16);
const Securitykey = crypto.randomBytes(32);

app.get('/',function(req,res){
    res.sendFile(__dirname+'/static/index.html');
});

app.post('/enc', function(req,res){
    const message1 = req.body.name1;
     const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);
     let decryptedData = decipher.update(message1, "hex", "utf-8");
     decryptedData += decipher.final("utf8");
    res.redirect('/?decrypted=' + decryptedData);
});

app.post('/', function(req, res){
    const message = req.body.name;
    const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
    let encryptedData = cipher.update(message, "utf-8", "hex");
    encryptedData += cipher.final("hex");
    res.redirect('/?encrypted=' + encryptedData);
  });

const port=3000
app.listen(port,()=>console.log(`Listening on port ${port}`));