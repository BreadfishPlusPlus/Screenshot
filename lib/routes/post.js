var spawn       = require('child_process').spawn;
var cache       = require(__dirname + '/../cache');
var phantomjs   = require('phantomjs');

module.exports = function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Type');

    var postId      = ~~req.params[0];
    var url         = 'http://forum.sa-mp.de/index.php?page=Thread&postID=' + postId;
    var fileName    = 'post_' + postId + '.png';
    var filePath    = process.env.SCREENSHOT_PATH + fileName;

    cache.has(filePath, function (has) {
        if (has) {
            res.sendFile(filePath, function (err) {
                if (err) {
                    res.end(err.stack);
                }
            });
            return;
        } else {
            var args = [__dirname + '/../capture.js', url, filePath, postId];
            console.log('spawn', phantomjs.path, args);

            var cptr = spawn(phantomjs.path, args);
            cptr.stdout.on('data', function (data) {
                console.log('cptr stdout: ' + data);
            });
            cptr.stderr.on('data', function (data) {
                console.log('cptr stderr: ' + data);
            });
            cptr.stderr.on('close', function () {
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