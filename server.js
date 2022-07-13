const express=require('express');
const app=express();
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
const crypto = require('crypto');
const algorithm = "aes-256-cbc"; 
const initVector = crypto.randomBytes(16);
const Securitykey = crypto.randomBytes(32);
var fs=require('fs');

app.get('/',function(req,res){
    res.sendFile(__dirname+'/static/index.html');
});

app.post('/enc', function(req,res){
    const message1 = req.body.name1;
     const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);
     let decryptedData = decipher.update(message1, "hex", "utf-8");
     decryptedData += decipher.final("utf8");
    //res.redirect('/?decrypted2=' + decryptedData);
    res.setHeader('Content-type', 'text/html');
    fs.readFile('./static/index.html', (err, html) => {
        if (err)
            res.write("Error");
        else {
            res.write(html);
            res.write('<br><h3>Decrypted Text:</h3>');
            res.write('<h3>' + decryptedData + '</h3>');
        }
        res.end();
    });
});

app.post('/', function(req, res){
    const message = req.body.name;
    const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
    let encryptedData = cipher.update(message, "utf-8", "hex");
    encryptedData += cipher.final("hex");
    //res.redirect('/?encrypted1=' + encryptedData);
    res.setHeader('Content-type', 'text/html');
    fs.readFile('./static/index.html', (err, html) => {
        if (err)
            res.write("Error");
        else{
            res.write(html);
             res.write('<br><h3>Encrypted Text:</h3>');
             res.write('<h3>'+encryptedData+'</h3>');
        }
        res.end();
    });
  });

const port=3000
app.listen(port,()=>console.log(`Listening on port ${port}`));