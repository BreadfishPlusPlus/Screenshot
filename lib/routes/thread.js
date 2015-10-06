"use strict";

const spawn         = require("child_process").spawn;
const cache         = require(__dirname + "/../cache");
const phantomjs     = require("phantomjs");
const debug         = require("debug")("thread");

module.exports = function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Expose-Headers", "Content-Type");

    const threadId    = ~~req.params[0];
    const pageNo      = ~~(req.params[1] || 1);
    const url         = "http://breadfish.de/index.php?thread/&id=" + threadId + "&pageNo=" + pageNo;
    const fileName    = "thread_"+ threadId + "-" + pageNo + ".png";
    const filePath    = process.env.SCREENSHOT_PATH + fileName;

    cache.has(filePath, function (has) {
        if (has) {
            res.sendFile(filePath, function (err) {
                if (err) {
                    res.end(err.stack);
                }
            });
            return;
        } else {
            const args = [__dirname + "/../capture.js", url, filePath];
            debug("spawn", phantomjs.path, args);

            const cptr = spawn(phantomjs.path, args);
            cptr.stdout.on("data", function (data) {
                debug("cptr stdout: " + data);
            });
            cptr.stderr.on("data", function (data) {
                debug("cptr stderr: " + data);
            });
            cptr.stderr.on("close", function () {
                res.sendFile(filePath, function (err) {
                    if (err) {
                        res.end(err.stack);
                    } else {
                        cache.put(filePath);
                    }
                });
            });
        }
    });
};
