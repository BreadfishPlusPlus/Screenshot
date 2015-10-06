"use strict";

const fs      = require("fs");
const debug   = require("debug")("cache");

const rem = function (filePath) {
    debug("deleting file \"%s\"…", filePath);
    fs.unlink(filePath, function (err) {
        if (err) {
            throw err;
        }
        debug("successfully deleted \"%s\"", filePath);
    });
};

const put = function (filePath) {
    debug("putting \"%s\" up for deletion in \"%s\" seconds", filePath, process.env.CACHE_TTL / 1000);
    setTimeout(function () {
        rem(filePath);
    }, process.env.CACHE_TTL);
};
exports.put = put;

const has = function (filePath, callback) {
    debug("checking file existance \"%s\"…", filePath);
    fs.exists(filePath, function (exists) {
        if (!exists) {
            debug("file \"%s\" doesnt exist", filePath);
            return callback(false);
        }
        debug("file \"%s\" exists", filePath);
        fs.stat(filePath, function (err, stats) {
            if (err) {
                debug("error getting stats for \"%s\":", filePath, err);
                return callback(false);
            }
            const now = Date.now();
            const okay = now - stats.mtime.getTime() < process.env.CACHE_TTL;
            debug("file \"%s\" is %s seconds old, therefore %s", filePath, (now - stats.mtime.getTime()) / 1000, okay ? "okay" : "not okay");
            return callback(okay);
        });
    });
};
exports.has = has;
