
// inizializzazione connessione a mongodb

var mongodb = require('mongodb').MongoClient
var url = 'mongodb://127.0.0.1:27017'
var dbase;
var record;
mongodb.connect(url, function (err, db) {

    dbase = db.db("lab");

})

exports.getDb = function () {
    return dbase;
}






