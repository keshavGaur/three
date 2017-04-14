var Response = require('./../vo/Response');
exports.execute = function (db, req, res, callback) {
    if (req.session.userId == undefined) {
        res.redirect("/login");
    }
    else {
        success = function(mediData){
            var response = new Response('success', mediData);
            callback(response);

        }
        error = function (err) {
            var response = new Response('fail', JSON.stringify(err));
            callback(response);
        }
        db.dbGlobal.getMedicineDescription([], success, error);
    }
}