// node moduli
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var ejs = require('ejs');





//inizializzazione moduli

var app= express()
app.use(cookieParser())
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
var routes = require('./Routes')
app.use('/',routes);

//Static paths

app.use('/node_modules',express.static('node_modules'));
app.use('/controller',express.static('controller'));
app.use('/css',express.static('css'));
app.use('/db',express.static('db'));
app.use('/upload',express.static('upload'));
app.use('/glyphicons',express.static('glyphicons'));
// inizializzazione Web Server
app.listen('8081', function (err) {
    if (err) {
        console.log("error 505");
    }
    
})
