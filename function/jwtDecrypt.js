var jwt= require('jsonwebtoken')

exports.tokenDecrypt=function(token)
    {
        var tokenDescripted= jwt.verify(token,'Alfa159jtdm!!*')
        return tokenDescripted.id
    }
exports.decryptGruppo=function(token)
{
    var tokenDescripted= jwt.verify(token,'Alfa159jtdm!!*')
    return tokenDescripted.gruppo
}
exports.decryptEmail=function(token)
{
    var tokenDescripted= jwt.verify(token,'Alfa159jtdm!!*')
    return tokenDescripted.email
}