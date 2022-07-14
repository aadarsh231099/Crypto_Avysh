const express = require('express')
const multer = require('multer')
const imageToBase64 = require('image-to-base64');
const decode = require('node-base64-image').decode
const NodeRSA = require('node-rsa');
const key = new NodeRSA({b: 1024});
const fs = require('fs')
const path = require('path')
const bodyparser = require('body-parser');
const app = express()
const crypto = require('crypto');
const algorithm = "aes-256-cbc"; 
const initVector = crypto.randomBytes(16);
const Securitykey = crypto.randomBytes(32);
const Blowfish = require('egoroof-blowfish');
const Encryption = require('node_triple_des');



var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now()+path.extname(file.originalname));
    },
  });
  
var upload = multer({ storage: storage }).single('file');
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())
app.use(express.static('public/uploads'))
const PORT = process.env.PORT || 5000
app.set('view engine','ejs')

app.get('/',(req,res) => {
    res.sendFile(__dirname+'/views/start.html');
})

app.get('/index',(req,res) => {
    res.render('index')
})

app.get('/index1',(req,res) => {
    res.render('index1')
})

app.get('/index2',(req,res) => {
    res.render('index2')
})

app.post('/encode', (req, res) => {
        //upload the file

        output = Date.now() + "output.txt"
        upload(req, res, (err) => {
            if (err) {
                console.log("Some error occured in uploading the file")
                return
            }
            else {
                console.log(req.file.path)

                //encode to base64
                imageToBase64(req.file.path) // Path to the image
                .then(
                    (response) => {
                        

                        fs.writeFileSync(output, response)

                        res.download(output, () => {
                            console.log("Base64 File is downloaded")
                        })
                    }
                )
                .catch(
                    (error) => {
                        console.log(error);
                    }
                )
            }
        })
    })

app.post('/decode', async (req, res) => {

    output = Date.now() + "output"
    upload(req,res,async (err) => {
        if(err) {
            console.log("Error took place !!")
            return
        }
        else {
            console.log(req.file.path)

            const base64code = fs.readFileSync(req.file.path, "utf-8")
            await decode(base64code, { fname: output, ext: 'jpg' });

            res.download(output + ".jpg", () => {
                console.log("Image File is downloaded")
            })
        }
    })
})

/*
app.post('/', function(req, res){
    const message = req.body.name;
    const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
    let encryptedData = cipher.update(message, "utf-8", "hex");
    encryptedData += cipher.final("hex");
    //res.redirect('/?encrypted1=' + encryptedData);
    res.setHeader('Content-type', 'text/html');
    fs.readFile('./views/index.ejs', (err, html) => {
        if (err)
            res.write("Error");
        else{
            res.write(html);
            res.write('<div class="form-group container"><h3>Encrypted Text:</h3><h3>'+encryptedData+'</h3><br><br>');
             }
        res.end();
    });
  });

app.post('/enc', function(req,res){
    const message1 = req.body.name1;
    const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);
    let decryptedData = decipher.update(message1, "hex", "utf-8");
    decryptedData += decipher.final("utf8");
    // res.redirect('/?decrypted2=' + decryptedData);
    res.setHeader('Content-type', 'text/html');
    fs.readFile('./views/index.ejs', (err, html) => {
        if (err)
            res.write("Error");
        else {
            res.write(html);
            res.write('<div class="form-group container"><h3>Decrypted Text:</h3><h3>'+decryptedData+'</h3><br><br>');
        }
        res.end();
    });
});
*/

app.post('/encrypt',(req,res) => {
    const {text,type} = req.body;
    //console.log(text,type);
    switch(type)
    {
        case "rsa": console.log("RSA technique");
                    var encryptedString = key.encrypt(text,'base64');
                    console.log("Encrypted text : ",encryptedString);
                    var decryptedString = key.decrypt(encryptedString,'utf-8');
                    console.log("Decrypted text : ",decryptedString);
                    break;
        
        case "tdes": console.log("TDES technique");
                     const encrypt =  Encryption.encrypt('SharedKey',text);
                     console.log("Encrypted text : ",encrypt);
                     const decrypt =  Encryption.decrypt('SharedKey', encrypt);
                     console.log("Decrypted text : ",decrypt);
                     break;

        case "aes": console.log("AES technique");
                    const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
                    let encryptedData = cipher.update(text, "utf-8", "hex");
                    encryptedData += cipher.final("hex");
                    console.log("Encrypted text : ",encryptedData);
                    const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);
                    let decryptedData = decipher.update(encryptedData, "hex", "utf-8");
                    decryptedData += decipher.final("utf8");
                    console.log("Decrypted text : ",decryptedData);
                    break;

        case "blowfish": console.log("BLOWFISH technique");
                         const bf = new Blowfish('super key', Blowfish.MODE.ECB, Blowfish.PADDING.NULL);
                         const encoded = bf.encode(text);
                         console.log("Encrypted text : ",encoded);
                         const decoded = bf.decode(encoded, Blowfish.TYPE.STRING);
                         console.log("Decrypted text : ",decoded);
                         break;

        default: console.log("Other technique");
                 break;    
    }
});



app.listen(PORT, () => {
    console.log("App is listening on port 5000")
})