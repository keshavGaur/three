var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var HashMap = require("hashmap").HashMap;
var session = require('express-session');

var routes = require('./routes/index');
var users = require('./routes/users');


var dbGlobals = require('./db/dbGlobal');
var Constants = require("./constants/constants");

var constants = new Constants(dbGlobals.dbGlobal, function (constants) {
    GLOBAL.constants = constants;
});

var app = express();

var map = new HashMap();
map.set("login", require('./routes/login'));
map.set("home", require('./routes/home'));
// map.set("ingredients", require('./routes/ingredients'));
// map.set("rawFood", require('./routes/rawFood'));
map.set("users", require('./routes/users'));
// map.set("nutrients", require('./routes/nutrients'));
// map.set("doAddIngredient", require('./routes/ajax/doAddIngredient'));
// map.set("doEditIngredient", require('./routes/ajax/doEditIngredient'));
// map.set("doDeleteIngredient", require('./routes/ajax/doDeleteIngredient'));

// map.set("doAddRawFood", require('./routes/ajax/doAddRawFood'));
// map.set("doEditRawFood", require('./routes/ajax/doEditRawFood'));
// map.set("doDeleteRawFood", require('./routes/ajax/doDeleteRawFood'));
//
// map.set("doAddNutrient", require('./routes/ajax/doAddNutrient'));
// map.set("doEditNutrient", require('./routes/ajax/doEditNutrient'));
// map.set("doDeleteNutrient", require('./routes/ajax/doDeleteNutrient'));

map.set("doLogout", require('./routes/ajax/doLogout'));
map.set("doLogin", require('./routes/ajax/doLogin'));
map.set("doDeleteUser", require('./routes/ajax/doDeleteUser'));

routes.pages(map);

routes.db(dbGlobals);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: '1234567890QWERTY',
    resave: true,
    saveUninitialized: true
}));

app.set("port", process.env.PORT || 3183);


app.get('/', routes.route);
app.get('/ajax/:ajaxCmd', routes.route);
app.post('/ajax/:ajaxCmd', routes.route);
app.get('/:page', routes.route);
app.get('/:page/:subpage', routes.route);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(logger('dev'));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(app.get('port'), function () {
    console.log("Express server is listening on port " + app.get("port"));
});

module.exports = app;
