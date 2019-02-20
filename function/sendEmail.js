var nodeMailer = require('nodemailer')
var serverInfo=({host:"192.168.24.207",port:25,secure:false,ignoreTLS: true})
var transporter = nodeMailer.createTransport(serverInfo)
exports.sendEmail=function(mittente,destinatario,subject,messaggio)
{
    
transporter.sendMail({from:mittente,to:destinatario,subject:subject.subject,html:'<table border="1"><tr><th>N. Richiesta</th><th>Product Number</th><th>Materiale</th></tr><tr><td>'+messaggio.numReq+'</td><td>'+messaggio.pn+'</td><td>'+messaggio.materiale+'</td></tr></table>'})
}