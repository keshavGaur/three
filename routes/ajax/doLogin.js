var Response = require('../../vo/Response');
exports.execute = function(db, req, res, callback){

    success = function(result){
        var response;
        if (result.length > 0) {
            response = new Response ('success', result[0]);
            req.session.userId = result[0].userId;
            req.session.emailId = result[0].emailId;
        }
        else {
            response = new Response ('fail', "EmailId, password are incorrect.");
        }
        callback(response);
    }
    error = function(err){
        var response = new Response('fail', JSON.stringify(err));
        callback(response);
    }
    db.dbGlobal.login( [req.body.emailId, req.body.password],success,error);
};