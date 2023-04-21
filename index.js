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
const Encryption = require('node_triple_des');
var encryptedString = '';
var decryptedString = '';


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now()+path.extname(file.originalname));
    },
  });
  
var upload = multer({ storage: storage }).single('file');         //storage variable for uploaded file
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())
app.use(express.static('public/uploads'))
const PORT = process.env.PORT || 5000                            //setting port value to 5000
app.set('view engine','ejs')

app.get('/',(req,res) => {
    res.sendFile(__dirname+'/views/start.html');          //route to the main page
})

app.get('/index',(req,res) => {
    res.render('index')                                   //route to the text encryption
})

app.get('/index1',(req,res) => {
    res.render('index1')                                  //route to the image encryption
})

app.get('/index2',(req,res) => {
    res.render('index2')                                  //route to the file encryption
})

//post request for text encryption
app.post('/encrypt',(req,res) => {
    const {text,type} = req.body;              //taking the text and the type as input from frontend
    console.log(text,type);
    switch(type)                               //different text encryption techniques
    {
        case "rsa": console.log("RSA technique");
                    encryptedString = key.encrypt(text,'base64');
                    console.log("Encrypted text : ",encryptedString);
                    break;
        
        case "tdes": console.log("TDES technique");
                     encryptedString =  Encryption.encrypt('SharedKey',text);
                     console.log("Encrypted text : ",encryptedString);
                     break;

        case "aes": console.log("AES technique");
                    const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
                    let encryptedData = cipher.update(text, "utf-8", "hex");
                    encryptedData += cipher.final("hex");
                    encryptedString=encryptedData;
                    console.log("Encrypted text : ",encryptedString);
                    break;

        default: console.log("Other technique");
                 break;    
    }
    res.send(encryptedString);                   //sending the encrypted text back to the frontend
});

//post request for text decryption
app.post('/decrypt',(req,res) => {
    const {text,type} = req.body;
    console.log(text,type);
    switch(type)
    {
        case "rsa": console.log("RSA technique");
                    decryptedString = key.decrypt(text,'utf-8');
                    console.log("Decrypted text : ",decryptedString);
                    break;
        
        case "tdes": console.log("TDES technique");
                     decryptedString =  Encryption.decrypt('SharedKey', text);
                     console.log("Decrypted text : ",decryptedString);
                     break;

        case "aes": console.log("AES technique");
                    const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);
                    let decryptedData = decipher.update(text, "hex", "utf-8");
                    decryptedData += decipher.final("utf8");
                    decryptedString=decryptedData;
                    console.log("Decrypted text : ",decryptedString);
                    break;

        default: console.log("Other technique");
                 break;    
    }
    res.send(decryptedString);                          //sending the decrypted text back to the frontend
});

//post request for image encryption
app.post('/encode', (req, res) => {
    //upload the file
    output = Date.now() + "output.txt"
    upload(req, res, (err) => {
        if (err) {
            console.log("some error occoured in uploading the file",err)
            return
        }
        else {
            console.log(req.file.path)

            //Encryption of the uploaded image using TDES technique
            imageToBase64(req.file.path)                           //Path to the image
                .then((response) => {

                    const encrypt = Encryption.encrypt('SharedKey', response);

                    fs.writeFileSync(output, encrypt)

                    //download the encrypted image
                    res.download(output, () => {
                        console.log("file is downloaded")
                    })

                })
                .catch((error) => {
                    console.log(error);                     //Logs an error if there was one 
                });
        }
    })
})

//post request for image decryption
app.post('/decode', async (req, res) => {

    output = Date.now() + "output"
    upload(req, res, async (err) => {
        if (err) {
            console.log("an error took place")
            return
        }
        else {
             //Decryption of the encrypted image using TDES technique
            console.log(req.file.path)

            const base64code = fs.readFileSync(req.file.path, "utf-8")
            
            const decrypt = Encryption.decrypt('SharedKey', base64code);
            
            await decode(decrypt, { fname: output, ext: "jpg" });

            //download the decrypted image
            res.download(output + ".jpg", () => {
                console.log("file is downloaded")
            })
        }
    })
})

//post request for file encryption
app.post('/encode1', (req, res) => {
    //upload the file

    output = Date.now() + "output.txt"
    upload(req, res, (err) => {
        if (err) {
            console.log("Some error occured in uploading the file")
            return
        }
        else {
            console.log(req.file.path)

            //Encryption of the uploaded file using RSA technique
            const pdf2base64 = require('pdf-to-base64');
            pdf2base64(req.file.path)                      // Path to the file
            .then(
                (response) => {
                    
                    encryptedString = key.encrypt(response,'base64');

                    fs.writeFileSync(output, encryptedString)

                    //download the encrypted file
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

//post request for file decryption
app.post('/decode1', async (req, res) => {

output = Date.now() + "output"
upload(req,res,async (err) => {
    if(err) {
        console.log("Error took place !!")
        return
    }
    else {
        //Decryption of the encrypted file using RSA technique
        console.log(req.file.path)

        const base64code = fs.readFileSync(req.file.path, "utf-8")

        decryptedString = key.decrypt(base64code,'utf-8');

        await decode(decryptedString, { fname: output, ext: 'pdf' });

        //download the decrypted pdf
        res.download(output + ".pdf", () => {
            console.log(" File is downloaded")
        })
    }
})
})

//Listening to port 5000
app.listen(PORT, () => {
    console.log("App is listening on port 5000")
})