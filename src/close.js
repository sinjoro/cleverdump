function exitApp(callback) {
    var moment = require('moment');
    var fs = require('node-fs');
    var glob = require('glob');
    var path = __dirname + '/../log/' + moment().format('YYYY-w') + '.log';

    fs.mkdirSync(__dirname + '/../log', '0777', true, true);
    fs.appendFileSync(path,'\n'+new Date().toString());

    var weekAgo = new Date() - 1000*60*60*24*7;
    var weekAgo2 = weekAgo - 1000*60*60*24*7;
    var path1 = __dirname + '/../log/' + moment(weekAgo).format('YYYY-w')+'.log';
    var path2 = __dirname + '/../log/' + moment(weekAgo2).format('YYYY-w')+'.log';
    var b1 = fs.existsSync(path1);
    var b2 = fs.existsSync(path2);
    callback(b1||b2);
}

module.exports = exitApp;
