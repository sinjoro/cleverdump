function exitApp(callback) {
    var moment = require('moment');
    var fs = require('node-fs');
    var glob = require('glob');
    var configCall = require('./config');
    var dirname = configCall().log + "/";
    fs.mkdirSync(dirname, '0777', true, true);
    var path = dirname + moment().format('YYYY-w') + '.log';
    fs.appendFileSync(path, '\n' + new Date().toString());

    var weekAgo = new Date() - 1000 * 60 * 60 * 24 * 7;
    var weekAgo2 = weekAgo - 1000 * 60 * 60 * 24 * 7;
    var path1 = dirname + moment(weekAgo).format('YYYY-w') + '.log';
    var path2 = dirname + moment(weekAgo2).format('YYYY-w') + '.log';
    var b1 = fs.existsSync(path1);
    var b2 = fs.existsSync(path2);
    callback(b1 && b2);
}

module.exports = exitApp;
