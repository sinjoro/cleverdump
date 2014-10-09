function makeConfig(){
    var config = require('./config.json');
    var fs = require('node-fs');

    if (!fs.existsSync(config.disk.needle)) {
        for (var key in config.disk.to){
            var to = config.disk.to[key];
            if (fs.existsSync(to)){
                makeReplace(config, config.disk.needle, to);
                break;
            }
        }
    }
    return config;
}

function makeReplace(config, needle, to){
    for (var key in config.dumps){
        config.dumps[key].to = config.dumps[key].to.replace(needle, to);
    }
    config.log.replace(needle, to);
}
module.exports = makeConfig;
