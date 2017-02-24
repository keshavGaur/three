exports.execute = function(db,req,res,callback){
    if(req.session.userId == undefined){
        res.redirect("/login");
    }
    else{
        callback({title:"home"});
    }
}