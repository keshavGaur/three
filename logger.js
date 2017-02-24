var winston = require('winston');
var _ = require('lodash');
var config = require('./config/config_loader')[process.env.NODE_ENV || 'DEV'];

winston.emitErrs = true;
exports.logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        }),
        new winston.transports.File({
            level: 'debug',
            filename: 'logs/nc_'+getShortDate()+'.log',
            name: 'debug.log',
            json: false,
            maxFiles: 5,
            maxsize: 10485760,
            colorize: false,
            timestamp: function () {
                return getDateData();
            }
        }),
        new winston.transports.File({
            level: 'info',
            filename: 'logs/NUTRITION_COUNTER_'+getShortDate()+'.log',
            name: 'NUTRITION_COUNTER_Info.log',
            json: false,
            maxFiles: 30,
            colorize: false,
            timestamp: function () {
                return getDateData();
            }
        }),
        new winston.transports.File({
            level: 'error',
            filename: 'logs/NUTRITION_COUNTER_'+getShortDate()+'.log',
            name: 'NUTRITION_COUNTER_Error.log',
            handleExceptions: true,
            json: false,
            maxFiles: 30,
            colorize: false,
            timestamp: function () {
                return getDateData();
            }
        }),
        new winston.transports.File({
            level: 'warn',
            filename: 'logs/NUTRITION_COUNTER_'+getShortDate()+'.log',
            name: 'NUTRITION_COUNTER_Warn.log',
            handleExceptions: true,
            json: false,
            maxFiles: 30,
            colorize: false,
            timestamp: function () {
                return getDateData();
            }
        })
    ],
    exceptionHandlers: [
        new winston.transports.File({
            filename: 'logs/runtime.log',
            json: false,
            maxFiles: 1,
            maxsize: 10485760 //10MB
        })
    ],
    exitOnError: false
});

function addLeadingZero(str, forMs) {
    if (forMs) {
        return String('00' + str).slice(-3);
    }
    return String('0' + str).slice(-2);
}
function getShortDate() {
    var d = new Date();
    var currDate = addLeadingZero(d.getDate());
    var currMonth = addLeadingZero(d.getMonth() + 1);
    var currYear = d.getFullYear();
    return currYear + '-' + currMonth + '-' + currDate;
}
function getDateData() {
    var d = new Date();
    var currDate = addLeadingZero(d.getDate());
    var currMonth = addLeadingZero(d.getMonth() + 1);
    var currYear = d.getFullYear();
    var currMin = addLeadingZero(d.getMinutes());
    var currHr = addLeadingZero(d.getHours());
    var currSc = addLeadingZero(d.getSeconds());
    var currMillisc = addLeadingZero(d.getMilliseconds(), true);

    return currYear + '-' + currMonth + '-' + currDate + ' ' + currHr + ':' + currMin + ':' + currSc + ',' + currMillisc;
}

function generateStack() {
    var i, length, splitStack;
    var stackTrace = new Error().stack;

    var result = [];
    splitStack = stackTrace.split('\n');
    for (i = 0, length = splitStack.length; i < length; i++) {
        if (splitStack[i] === 'Error') {
            continue;
        }
        if (splitStack[i].indexOf(__filename) === -1) {
            result.push(_.trim(splitStack[i]));
        }
    }
    return result.join('->');
}

module.exports.LogLevel = {
    DEBUG: 'debug',
    VERBOSE: 'verbose',
    INFO: 'info',
    WARN: 'warn',
    ERROR: 'error'
};
module.exports.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};
module.exports = {
    LOG_LEVEL: config.log_level,
    ENV: process.env['NODE_ENV'],
    debug: function (msg, obj) {
        this.writeLog(exports.LogLevel.DEBUG, msg, obj);
    },
    info: function (msg, obj) {
        this.writeLog(exports.LogLevel.INFO, msg, obj);
    },
    warning: function (msg, obj) {
       this.writeLog(exports.LogLevel.WARN, msg,obj);
    },
    error: function (msg, obj) {
       this.writeLog(exports.LogLevel.ERROR, msg,obj);
    },
    writeLog: function (logLevel, msg, obj) {
        if (_.isObject(msg)) {
            obj = msg;
            msg = '';
        }

        var metadata = {};
        if (obj instanceof Error) {
            metadata.stack = obj.stack;
            metadata.localStack = generateStack();
            if (!msg) {
                msg = obj.message || 'No message was given';
            } else {
                metadata.data = obj.message;
            }
        } else {
            if (_.isObject(obj)) {
                if (obj.toString === Object.prototype.toString) {
                    metadata.data = JSON.stringify(obj);
                } else {
                    metadata.data = obj.toString();
                }
            }
            if (_.isString(obj) || _.isNumber(obj) || _.isBoolean(obj)) {
                metadata.data = obj;
            }
        }

        exports.logger.log(logLevel, msg, metadata);
    }
};