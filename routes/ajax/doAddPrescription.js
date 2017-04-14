var Response = require('../../vo/Response');
exports.execute = function(db, req, res, callback){

    success = function(result){
        var response = new Response('success', null);
        callback(response);
    }
    error = function(err){
        var response = new Response('fail', JSON.stringify(err));
        callback(response);
    }
    db.dbGlobal.deleteUser( [req.body.userId],success,error);
};