var express = require('express');
var router = express.Router();
var dbase = require('./dbconn')
var binary = require('mongodb').Binary
var ObjectID = require('mongodb').ObjectID;
var formidable = require('formidable')
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt');
var fs = require('fs')
var jwtDecrypt = require('./function/jwtDecrypt')
var sendEmail= require('./function/sendEmail')
var risultato = [{
    "pn": "",
    "materiale": "",
    "specapp": "",
    "bem": "",
    "databem": "",
    "odv": "",
    "lotto": "",
    "disegno": "",
    "note": "",
}]
var adminUser=({email:"manicuti.danilo@simmeldifesa.com"})

var secretKey = "Alfa159jtdm!!*"

//middleware da applicare a tutte le rotte per verificare la validita del token

router.use('/app', function (req, res, next) {

    jwt.verify(req.cookies.token, secretKey, function (err, decoded) {
        if (err) {
            
           res.render(__dirname + '/views/' + 'login.ejs');
           
          
            
        }
        else {

            
            next()
        }
    })



})
//****************** ROTTE GET *******************************************/

// rotta per richiamare la pagina di login

router.get('/', function (req, res) {

    res.render(__dirname + '/views/' + 'login.ejs');
});

// rotta per richiamare la pagina di registrazione nuovo utente

router.get('/form_registrazione', function (req, res) {
    res.render(__dirname + '/views/' + 'registrazione.ejs',{error:0});
})

// rotta per richiamare la pagina principale dell'applicazione

router.get('/app/mainpage', function (req, res) {
    var adminValue = jwtDecrypt.decryptGruppo(req.cookies.token)
    
    res.render(__dirname + '/views/' + 'mainPage.ejs', {admin: adminValue,user:jwtDecrypt.decryptEmail(req.cookies.token)});
});


//Rotta per richiamare la pagina di inserimento richiesta

router.get('/app/addtest', function (req, res) {

    res.render(__dirname + '/views/' + 'richiesta.ejs', { ris: risultato, read: 1 });
});

//Rotta per ottenere la lista delle analisi disponibili

router.get('/app/getanalisi', function (req, res) {
    dbase.getDb().collection("Analisi").find().sort({ prova: 1 }).toArray(function (err, risultato) {
        res.json(risultato)
    })
})

//Rotta per ottenere la lista delle richieste di analisi Aperte dal DB

router.get('/app/getRichichiesteAperte', function (req, res) {
    if (jwtDecrypt.decryptGruppo(req.cookies.token)==1)
        {
            
            
                    dbase.getDb().collection("richieste").aggregate([{ $match: {"stato":0}},{$lookup:{from:"users",localField:"utente",foreignField:"_id",as: "infoutente"}},{ "$unwind": "$infoutente" }]).sort({numReq:-1}).toArray(function (err, risultato) {
                        
                        res.json(risultato)
            })  
        }
        else{
            dbase.getDb().collection("richieste").aggregate([{ $match: {"stato":0,utente: ObjectID(jwtDecrypt.tokenDecrypt(req.cookies.token))}},{$lookup:{from:"users",localField:"utente",foreignField:"_id",as: "infoutente"}},{ "$unwind": "$infoutente" }]).sort({numReq:-1}).toArray(function (err, risultato) {
                res.json(risultato)
            })  
        }

})



//Rotta per ottenere la lista delle richieste di analisi Chiuse dal DB

router.get('/app/getRichiesteChiuse', function (req, res) {
    if (jwtDecrypt.decryptGruppo(req.cookies.token)==1)
        {
            dbase.getDb().collection("richieste").aggregate([{ $match: {"stato":1}},{$lookup:{from:"users",localField:"utente",foreignField:"_id",as: "infoutente"}},{ "$unwind": "$infoutente" }]).sort({numReq:-1}).toArray(function (err, risultato) {
                res.json(risultato)
            })  
        }
        else{
            
            dbase.getDb().collection("richieste").aggregate([{ $match: {"stato":1,utente: ObjectID(jwtDecrypt.tokenDecrypt(req.cookies.token))}},{$lookup:{from:"users",localField:"utente",foreignField:"_id",as: "infoutente"}},{ "$unwind": "$infoutente" }]).sort({numReq:-1}).toArray(function (err, risultato) {
                res.json(risultato)
            })  
        }
    
    
})

//Rotta per ottenere le analisi in base a criteri di ricerca

router.get('/app/getAllRichieste', function (req, res) {
    
    if (jwtDecrypt.decryptGruppo(req.cookies.token)==1)
        {
            
            dbase.getDb().collection("richieste").aggregate([{ $match: {$text:{$search:req.query.itemToSearch}}},{$lookup:{from:"users",localField:"utente",foreignField:"_id",as: "infoutente"}},{ "$unwind": "$infoutente" }]).sort({numReq:-1}).toArray(function (err, risultato) {
                
                res.json(risultato)
            })  
        }
        else{
            
            dbase.getDb().collection("richieste").aggregate([{ $match: {$text:{$search:req.query.itemToSearch},utente: ObjectID(jwtDecrypt.tokenDecrypt(req.cookies.token))}},{$lookup:{from:"users",localField:"utente",foreignField:"_id",as: "infoutente"}},{ "$unwind": "$infoutente" }]).sort({numReq:-1}).toArray(function (err, risultato) {
                res.json(risultato)
            })  
        }
    
    
})

//Rotta per ottenere la pagina di gestione delle richieste aperte

router.get('/app/richiesteAperte', function (req, res) {
   var adminValue = jwtDecrypt.decryptGruppo(req.cookies.token)
    
    res.render(__dirname + '/views/' + 'listaRichieste.ejs', { statorichiesta: 0 ,admin:adminValue});
})


//Rotta per ottenere la pagina di gestione delle richieste chiuse

router.get('/app/richiesteChiuse', function (req, res) {
    var adminValue = jwtDecrypt.decryptGruppo(req.cookies.token)
    res.render(__dirname + '/views/' + 'listaRichieste.ejs', { statorichiesta: 1,admin:adminValue  });
})

router.get('/app/richiesteAll', function (req, res) {
    var adminValue = jwtDecrypt.decryptGruppo(req.cookies.token)
    res.render(__dirname + '/views/' + 'listaRichieste.ejs', { statorichiesta: 2,admin:adminValue  });
})

//Rotta per ottenere la pagina di visualizzazione di una richiesta specifica

router.get('/app/viewRichiesta', function (req, res) {
    dbase.getDb().collection("richieste").find({ _id: ObjectID(req.query.idrichiesta) }).toArray(function (err, risultato) {

        res.render(__dirname + '/views/' + 'richiesta.ejs', { ris: risultato, read: 2 })
    })
})


//Rotta per ottenere la richiesta da modificare

router.get('/app/editRichiesta', function (req, res) {
    dbase.getDb().collection("richieste").find({ _id: ObjectID(req.query.idrichiesta) }).toArray(function (err, risultato) {

        res.render(__dirname + '/views/' + 'richiesta.ejs', { ris: risultato, read: 3 })
    })
})

//Rotta per ottenere il file report associato alla richiesta

router.get('/app/getReport', function (req, res) {
    
    dbase.getDb().collection("richieste").findOne({ _id: ObjectID(req.query.idrichiesta) }, function (err, doc) {
        
        res.end(doc.report.buffer)
        
        

    })
})

router.get('/app/verifyUsername',function(req,res)
{
    dbase.getDb().collection("users").findOne({email:req.query.email},function(err,email)
{
    
})
})
//****************** ROTTE POST *******************************************/

//Rotta per aggiungere Richiesta di Analisi al Database

router.post('/app/addRichiesta', function (req, res) {
    req.body.utente =ObjectID(jwtDecrypt.tokenDecrypt(req.cookies.token))
    var mittente = jwtDecrypt.decryptEmail(req.cookies.token)
    dbase.getDb().collection("counter").findOneAndUpdate({_id:"userid"},{$inc:{seq:1}},{returnOriginal:false},function(err,doc)
{
    req.body.numReq=doc.value.seq
    dbase.getDb().collection("richieste").insert(req.body,function(err,record)
    {
    if (err)
        {
            res.sendStatus(500)
        }
        else
            {
                sendEmail.sendEmail(mittente,adminUser.email,{subject:"Richiesta Analisi di Laboratorio"},req.body)
                
                res.sendStatus(200)
    
            }
    })
    
})

    
   
})

//Rotta di autenticazione e generazione token in caso di successo 

router.post('/authentication', function (req, res) {

    dbase.getDb().collection("users").findOne({ email: req.body.email }, function (err, utente) {
        if(req.body.password=="" || req.body.email=="")
            {
                return
            }
        
        bcrypt.compare(req.body.password, utente.password, function (err1, res2) {
           
            if (res2) {
                jwt.sign({ id: utente._id, email: utente.email,gruppo:utente.admin }, secretKey, function (err, token) {
                    res.cookie('token', token, { maxAge: 1200000 }).redirect('/app/mainpage') 
                    
                    
                })


            }
            
        })
    })
})

//Rotta per registrare un nuovo utente

router.post('/registrazione', function (req, res) {

    bcrypt.hash(req.body.password, 10, function (err, hash) {
        dbase.getDb().collection("users").insert({ nome:req.body.nome, cognome:req.body.cognome,email: req.body.email, password: hash }, function (err, res1) {
            if (err) {
                
                
                res.render(__dirname + '/views/' + 'registrazione.ejs',{error:1});
            }else
            {
            res.render(__dirname + '/views/' + 'login.ejs');
            }
        })
    })
})


//****************** ROTTE PUT *******************************************/

//Rotta per memorizzare le modifiche effettuate su una richiesta di analisi

router.put('/app/editRichiesta', function (req, res) {

    dbase.getDb().collection("richieste").updateOne({ _id: ObjectID(req.body.id) }, { $set: req.body.valori }, function (err, res1) {
        if (err) {
            res1.sendStatus(404)
        }
        
        
    })
    res.sendStatus(200)
})

//Rotta cambiare password

router.post('/app/cambiaPassword',function(req,res){
    
    dbase.getDb().collection("users").updateOne({_id:ObjectID(jwtDecrypt.tokenDecrypt(req.cookies.token))},{$set:{password:bcrypt.hashSync(req.body.password, 10)}})
    res.render(__dirname + '/views/' + 'login.ejs');
})

//Rotta per chiusura richiesta di analisi e caricamento report

router.put('/app/addImage', function (req, res) {
    var form = new formidable.IncomingForm()
    form.parse(req, function (err, field, files) {

        var encodedImage = fs.readFileSync(files.file.path)
        buffer1 = new Buffer(encodedImage)
        file_bin = new binary(buffer1)
        dbase.getDb().collection("richieste").updateOne({ _id: ObjectID(req.query.richiesta) }, { $set: { report: file_bin, stato: 1 } }, function (err1, res1) {
            if (err1) {
                res.sendStatus(404)
            }else 
            {
                var destinatario = jwtDecrypt.decryptEmail(req.cookies.token)
                sendEmail.sendEmail(adminUser.email,destinatario,{subject:"Esito Analisi di Laboratorio"},req.query)
                res.sendStatus(200)
                
            }
            
        })
    })
    
    
})

//****************** ROTTE DELETE *******************************************/

//Rotta per cancellare una richiesta di analisi

router.delete('/app/deleteRichiesta', function (req, res) {

    dbase.getDb().collection("richieste").deleteOne({ _id: ObjectID(req.query.idrichiesta) })
    res.sendStatus(200)

})


//****************** TEST ROTTE *******************************************/




module.exports = router;