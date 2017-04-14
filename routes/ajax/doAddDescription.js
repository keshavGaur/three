var Response = require('../../vo/Response');
var querystring = require('querystring');

exports.execute = function(db, req, res, callback){
    success = function(result) {

        var response = new Response('success', null);
        callback(response);
    }
    error = function(err){
        var response = new Response('fail', JSON.stringify(err));
        callback(response);
    }
    reqObj = querystring.parse(req.query.data);
    db.doAddprescription( reqObj,success,error);

};
