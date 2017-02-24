module.exports = function(db,callback){
    db.constants([],function (result){
        var constants = {};
        if(result.length >0){
            for(var i = 0 ; i < result.length ; i++){
                constants[result[i].constantName] = result[i].constantValue;
            }
            callback(constants);
        }
        else
            callback;

    },function(error){

    });
}