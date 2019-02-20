var mongodb = require('mongodb')
var url='mongodb://127.0.0.1:27017/lab'
var dbase = mongodb.connect(url)
module.exports=dbase