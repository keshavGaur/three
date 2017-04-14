
var dbConfig = require('./../config/config_loader')["DEV"].db;
var _ = require('lodash');
var mysql = require('mysql');
var Logger = require('./../logger');

function DBHandler(){
    this._host = dbConfig.host;
    this._username = dbConfig.username;
    this._password = dbConfig.password;
    this._database = dbConfig.database;
    this._multipleStatements = true;
    this.establishConnection();
}


DBHandler.prototype.establishConnection = function () {
    Logger.info("DBHandler.protoype.establishConnection");
    if (this._pool != undefined) {
        Logger.info("DBHandler.protoype.establishConnection", 'DB already connected');
        return;
    }
    this._pool = mysql.createPool({
        host: this._host,
        user: this._username,
        password: this._password,
        database: this._database,
        connectionLimit: 100,
        multipleStatements: this._multipleStatements
    });
}

DBHandler.prototype.constants = function(data,success,error){
    Logger.info("DBHandler.prototype.constants");
    var self = this;
    var query = "select * from constants;";
    this._pool.getConnection(function(err,connection){
        self.executeQuery (err,connection,query,data,success,error);
    });

}

DBHandler.prototype.login = function(data,success,error){
    Logger.info("DBHandler.prototype.login");
    var self = this;
    var query = "select userId ,emailId from user_master where emailId = '"+data[0]+"' and password = '"+data[1]+"' and roleId = "+GLOBAL.constants.ADMIN+"";
    this._pool.getConnection(function(err,connection){
        self.executeQuery (err,connection,query,data,success,error);
    });
}

DBHandler.prototype.getMedicines = function(data,success,error){
    Logger.info("DBHandler.prototype.getMedicines");
    var self = this;
    var query = "select medicineName,description from medicine_master where status = 1";
    this._pool.getConnection(function(err,connection){
        self.executeQuery (err,connection,query,data,function(medicines){
            self.getMedicineDescription([],function(descp){
                success(medicines,descp);
            },error)
        },error);
    });
}
//to add description of medicine
DBHandler.prototype.addDescription = function(data,success,error){
    Logger.info("DBHandler.prototype.addDescription");
    var self = this;
    var query = "select medicineName,description from medicine_master where status = 1";
    this._pool.getConnection(function(err,connection){
        self.executeQuery (err,connection,query,data,function(medicines){
            self.getMedicineDescription([],function(descp){
                success(medicines,descp);
            },error)
        },error);
    });
}

DBHandler.prototype.getMedicinePrescription = function(data,success,error){
    Logger.info("DBHandler.prototype.getMedicinePrescription");
    var self = this;
    var query = "select up.userId,um.userName,up.prescriptionName from user_master um RIGHT JOIN user_pres up ON um.userId = up.userId";
    this._pool.getConnection(function(err,connection){
        self.executeQuery (err,connection,query,data,success,error);
    });
}

DBHandler.prototype.getMedicineDescription = function(data,success,error){
    Logger.info("DBHandler.prototype.getMedicineDescription");
    var self = this;
    var query = "select * from medicine_master";
    this._pool.getConnection(function(err,connection){
        self.executeQuery (err,connection,query,data,success,error);
    });
}

DBHandler.prototype.getPres = function(data,success,error){
    Logger.info("DBHandler.prototype.getPres");
    var self = this;
    var query = "select * from user_pres";
    this._pool.getConnection(function(err,connection){
        self.executeQuery (err,connection,query,data,function(prescriptions){
            self.getPresUsers([],function(presUsers){
                success(prescriptions,presUsers);
            },error)
        },error);
    });
}

DBHandler.prototype.getPresUsers = function(data,success,error){
    Logger.info("DBHandler.prototype.getPresUsers");
    var self = this;
    var query = "select userName from user_master RIGHT JOIN user_pres on user_master.userId = user_pres.userId;";
    this._pool.getConnection(function(err,connection){
        self.executeQuery (err,connection,query,data,success,error);
    });
}

DBHandler.prototype.doAddIngredientAndNutrients = function(dataObj,success,error){
    Logger.info("DBHandler.prototype.doAddIngredientAndNutrients");
    var self = this;
    var query = "insert into ingredient_master(ingredientName)  values('"+dataObj.ingredientName+"')";
    this._pool.getConnection(function(err,connection){
        connection.beginTransaction(function(err){
            if(err)
                error(err);
        self.executeQueryTransaction (connection,query,dataObj,function(result){
            var ingredeintId = result.insertId;
            dataObj.ingredientId = ingredeintId;
           self.doAddNutrients(connection,dataObj,success,error);
        },function(err){
            connection.rollback(function(){ error(err);});
            error(err);
        });
        });
    });
}

DBHandler.prototype.doAddNutrients = function(connection,dataObj,success,error){
    Logger.info("DBHandler.prototype.doAddNutrients");
    var self = this;
    var ingredientNutrition = [];
    var keys = Object.keys(dataObj).length -2 //subract ingredientname and ingrdeintId key to get nutrients count
    for(var i = 1 ; i <=keys ; i++){
        ingredientNutrition.push([dataObj.ingredientId,i,dataObj[i]]);
    }
    var query = "insert into ingredient_nutrition_trans(ingredientId,nutrientId,nutritionValue) values ?";
    self.executeQueryTransaction (connection,query,[ingredientNutrition],function(){
        connection.commit(function(err) {
            if (err) {
                connection.rollback(function() {
                    error(err);
                });
            }
            connection.release();
            success();
        });
    },function(err){
        connection.rollback(function(){ error(err);});
        error(err);
    });
}

DBHandler.prototype.doAddRawFoodAndNutrients = function(dataObj,success,error){
    Logger.info("DBHandler.prototype.doAddRawFoodAndNutrients");
    var self = this;
    var query = "insert into raw_food_master(rawFoodName)  values('"+dataObj.rawFoodName+"')";
    this._pool.getConnection(function(err,connection){
        connection.beginTransaction(function(err){
            if(err)
                error(err);
            self.executeQueryTransaction (connection,query,dataObj,function(result){
                var rawFoodId = result.insertId;
                dataObj.rawFoodId = rawFoodId;
                self.doAddNutrients(connection,dataObj,success,error);
            },function(err){
                connection.rollback(function(){ error(err);});
                error(err);
            });
        });
    });
}

DBHandler.prototype.doAddNutrients = function(connection,dataObj,success,error){
    Logger.info("DBHandler.prototype.doAddNutrients");
    var self = this;
    var rawFoodNutrition = [];
    var keys = Object.keys(dataObj).length -2 //subract ingredientname and ingrdeintId key to get nutrients count
    for(var i = 1 ; i <=keys ; i++){
        rawFoodNutrition.push([dataObj.rawFoodId,i,dataObj[i]]);
    }
    var query = "insert into raw_food_nutrition_trans(rawFoodId,nutrientId,nutritionValue) values ?";
    self.executeQueryTransaction (connection,query,[rawFoodNutrition],function(){
        connection.commit(function(err) {
            if (err) {
                connection.rollback(function() {
                    error(err);
                });
            }
            connection.release();
            success();
        });
    },function(err){
        connection.rollback(function(){ error(err);});
        error(err);
    });
}

DBHandler.prototype.getNutrients = function(data,success,error){
    Logger.info("DBHandler.prototype.getNutrients");
    var self = this;
    var query = "select nutrientId,nutrientName from nutrients_master where status =1 ";
    this._pool.getConnection(function(err,connection){
        self.executeQuery (err,connection,query,data,success,error);
    });
}

DBHandler.prototype.addNutrientsFact = function(data,success,error){
    Logger.info("DBHandler.prototype.addNutrientsFact");
    var self = this;
    var query = "INSERT into nutrients_master (nutrientName,lowValue,medValue,highValue) values ('"+data.nutrientName+"',"+data.low+","+data.med+","+data.high+")";
    this._pool.getConnection(function(err,connection){
        self.executeQuery (err,connection,query,data,success,error);
    });
}

DBHandler.prototype.getNutrientsFact = function(success,error){
    Logger.info("DBHandler.prototype.getNutrientsFact");
    var self = this;
    var query = "select nutrientId,nutrientName,lowValue,medValue,highValue from nutrients_master nm where nm.status=1";
    this._pool.getConnection(function(err,connection){
        self.executeQuery (err,connection,query,null,success,error);
    });
}

DBHandler.prototype.editIngredient = function(dataObj,success,error){
    Logger.info("DBHandler.prototype.editIngredient");
    var self = this;

    var query = "update ingredient_master set ingredientName = '"+dataObj.ingredientName+"' where ingredientId = "+dataObj.ingredientId+"";
    this._pool.getConnection(function(err,connection){
        connection.beginTransaction(function(err){
            if(err)
                error(err);
            self.executeQueryTransaction (connection,query,dataObj,function(result){
                self.updateIngredientNutrients(connection,dataObj,success,function(err){
                    connection.rollback(function(){ error(err);});
                    error(err);
                });
            });
        });
    });
}

DBHandler.prototype.updateIngredientNutrients = function(connection,dataObj,success,error){
    Logger.info("DBHandler.prototype.updateIngredientNutrients");
    var self = this;
    var ingredientNutrition = [];
    var keys = Object.keys(dataObj).length -2 //subract ingredientname and ingrdeintId key to get nutrients count
    var queryColl;
    for(var i = 1 ; i <=keys ; i++){
        var query = "insert into ingredient_nutrition_trans(ingredientId,nutrientId,nutritionValue) values("+dataObj.ingredientId+","+i+","+dataObj[i]+") ON DUPLICATE KEY" +
            " update nutritionValue = "+dataObj[i]+" ";
        if(i == keys)
            queryColl = queryColl + query;
        else if(i == 1)
            queryColl =  query +";";
        else
            queryColl =  queryColl +query +";";
    }
    self.executeQueryTransaction(connection,queryColl,null,function(){
        connection.commit(function(err) {
            if (err) {
                connection.rollback(function() {
                    error(err);
                });
            }
            connection.release();
            success();
        });
    },function(err){
        connection.rollback(function(){ error(err);});
        error(err);
    });
}

DBHandler.prototype.editRawFood = function(dataObj,success,error){
    Logger.info("DBHandler.prototype.editRawFood");
    var self = this;

    var query = "update raw_food_master set rawFoodName = '"+dataObj.rawFoodName+"' where rawFoodId = "+dataObj.rawFoodId+"";
    this._pool.getConnection(function(err,connection){
        connection.beginTransaction(function(err){
            if(err)
                error(err);
            self.executeQueryTransaction (connection,query,dataObj,function(result){
                self.updateRawFoodNutrients(connection,dataObj,success,function(err){
                    connection.rollback(function(){ error(err);});
                    error(err);
                });
            });
        });
    });
}

DBHandler.prototype.updateRawFoodNutrients = function(connection,dataObj,success,error){
    Logger.info("DBHandler.prototype.updateRawFoodNutrients");
    var self = this;
    var ingredientNutrition = [];
    var keys = Object.keys(dataObj).length -2 //subract ingredientname and ingrdeintId key to get nutrients count
    var queryColl;
    for(var i = 1 ; i <=keys ; i++){
        var query = "insert into raw_food_nutrition_trans(rawFoodId,nutrientId,nutritionValue) values("+dataObj.rawFoodId+","+i+","+dataObj[i]+") ON DUPLICATE KEY" +
            " update nutritionValue = "+dataObj[i]+" ";
        if(i == keys)
            queryColl = queryColl + query;
        else if(i == 1)
            queryColl =  query +";";
        else
            queryColl =  queryColl +query +";";
    }
    self.executeQueryTransaction(connection,queryColl,null,function(){
        connection.commit(function(err) {
            if (err) {
                connection.rollback(function() {
                    error(err);
                });
            }
            connection.release();
            success();
        });
    },function(err){
        connection.rollback(function(){ error(err);});
        error(err);
    });
}

DBHandler.prototype.editNutrients = function(dataObj,success,error){
    Logger.info("DBHandler.prototype.editNutrients");
    var self = this;

    var query = "update nutrients_master set nutrientName = '"+dataObj.nutrientName+"'" +
        " ,lowValue = "+dataObj.low+",medValue = "+dataObj.med+",highValue = "+dataObj.high+"  where nutrientId = "+dataObj.nutrientId+"";

    this._pool.getConnection(function(err,connection){
        self.executeQuery (err,connection,query,dataObj,success,error);
    });
}

DBHandler.prototype.deleteIngredient = function(data,success,error){
    Logger.info("DBHandler.prototype.deleteIngredient");
    var self = this;
    var query = "update ingredient_master set status = 0 where ingredientId = ?";
    this._pool.getConnection(function(err,connection){
        self.executeQuery (err,connection,query,data,success,error);
    });
}

DBHandler.prototype.deleteRawFood = function(data,success,error){
    Logger.info("DBHandler.prototype.deleteRawFood");
    var self = this;
    var query = "update raw_food_master set status = 0 where rawFoodId = ?";
    this._pool.getConnection(function(err,connection){
        self.executeQuery (err,connection,query,data,success,error);
    });
}


DBHandler.prototype.deleteNutrient = function(data,success,error){
    Logger.info("DBHandler.prototype.deleteNutrient");
    var self = this;
    var query = "update nutrients_master set status = 0 where nutrientId = ?";
    this._pool.getConnection(function(err,connection){
        self.executeQuery (err,connection,query,data,success,error);
    });
}

DBHandler.prototype.getUsers = function(success,error){
    Logger.info("DBHandler.prototype.getUsers");
    var self = this;
    var query = "select userId,userName,emailId from user_master where roleId = 2 AND status = 1 order by userId";

    this._pool.getConnection(function(err,connection){
        self.executeQuery (err,connection,query,null,success,error);
    });
}

DBHandler.prototype.deleteUser = function(data,success,error){
    Logger.info("DBHandler.prototype.deleteUser");
    var self = this;
    var query = "update user_master set status = 2 where userId=?";
    this._pool.getConnection(function(err,connection){
        self.executeQuery (err,connection,query,data,success,error);
    });
}

DBHandler.prototype.executeQuery = function (err, connection, query, paramArr, cbSuccess, cbError, cbParam) {
    var self = this;
    connection.query(query, paramArr, function (err, rows) {
        Logger.info('DBHandler.prototype.executeQuery', connection.format(query, paramArr));
        if (err) {
            console.error(err);
            Logger.error('Error in DBHandler.prototype.executeQuery ', err);
            _.isFunction(cbError) && cbError.call(self, err);
        } else {
            _.isFunction(cbSuccess) && cbSuccess.call(self, rows, cbParam);
        }
    });
    connection.release();
}


DBHandler.prototype.executeQueryTransaction = function (connection, query, paramArr, cbSuccess, cbError, cbParam) {
    var self = this;
    connection.query(query, paramArr, function (err, rows) {
        Logger.info('DBHandler.prototype.executeQueryTransaction', connection.format(query, paramArr));
        if (err) {
            Logger.error('Error in DBHandler.prototype.executeQueryTransaction ', err);
            _.isFunction(cbError) && cbError.call(self, err);
        } else {
            _.isFunction(cbSuccess) && cbSuccess.call(self, rows, cbParam);
        }
    });
    //connection.release();
};
    module.exports = DBHandler;




