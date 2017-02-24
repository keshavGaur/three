var Response = require('../../vo/Response');
exports.execute = function(db, req, res, callback){
    req.session.destroy();
    var response = new Response ('success', null);
    callback (response);
};
