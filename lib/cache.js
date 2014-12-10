var fs      = require('fs');
var debug   = require('debug')('cache');

var rem = function (filePath) {
    debug('deleting file "%s"…', filePath);
    fs.unlink(filePath, function (err) {
        if (err) {
            throw err;
        }
        debug('successfully deleted "%s"', filePath);
    });
};

var put = function (filePath) {
    debug('putting "%s" up for deletion in "%s" seconds', filePath, process.env.CACHE_TTL / 1000);
    setTimeout(function () {
        rem(filePath);
    }, process.env.CACHE_TTL);
};
exports.put = put;

var has = function (filePath, callback) {
    debug('checking file existance "%s"…', filePath);
    fs.exists(filePath, function (exists) {
        if (!exists) {
            debug('file "%s" doesnt exist', filePath);
            return callback(false);
        }
        debug('file "%s" exists', filePath);
        fs.stat(filePath, function (err, stats) {
            if (err) {
                debug('error getting stats for "%s":', filePath, err);
                return callback(false);
            }
            var now = Date.now();
            var okay = now - stats.mtime.getTime() < process.env.CACHE_TTL;
            debug('file "%s" is %s seconds old, therefore %s', filePath, (now - stats.mtime.getTime()) / 1000, okay ? 'okay' : 'not okay');
            return callback(okay);
        });
    });
};
exports.has = has;