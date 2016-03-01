const debug = require("debug")("route:post");

import {getEnv} from "./getEnv";
import {execFile} from "child_process";
import {join} from "path";
import {split, filter, isEmpty} from "lodash";
import {path as phantomPath} from "phantomjs-prebuilt";
import {isCached, putInCache} from "./cache";


const WIDTH_POST = getEnv("WIDTH_POST").optional(1024).number();
const USER_AGENT = getEnv("USER_AGENT").required().string();
const IMAGE_QUALITY = getEnv("IMAGE_QUALITY").optional(50).number();

const SCRIPT_FILE = join(__dirname, "..", "src", "phantom_scripts", "post.js");

export const createPostRoute = (webserver) => {

    webserver.get(/\/post\/(\d+)(?:\.png)?/, async (req, res) => {

        const postId = parseInt(req.params[0], 10);
        const fileName = `post_${postId}.png`;
        const filePath = join(__dirname, "..", "screenshots", fileName);

        if (await isCached(fileName)) {
            res.sendFile(filePath, (sendFileError) => {
                if (sendFileError) {
                    debug("error sending file");
                    debug(sendFileError);
                    return res.status(500).end();
                }
                debug("file send");
            });
            return;
        }


        debug({postId, fileName, filePath});

        const args = [
            SCRIPT_FILE,
            postId,
            filePath,
            USER_AGENT,
            WIDTH_POST,
            IMAGE_QUALITY
        ];

        debug(`executing ${phantomPath} ${args}`);
        let exec = execFile(phantomPath, args);
        exec.stdout.on("data", (stdout) => {
            filter(split(stdout, "\n"), (l) => !isEmpty(l)).forEach((stdout) => debug({stdout}));
        });
        exec.stderr.on("data", (stderr) => {
            filter(split(stderr, "\n"), (l) => !isEmpty(l)).forEach((stderr) => debug({stderr}));
        });
        exec.on("close", (code) => {
            debug(`child process exited with code ${code}`);
            if (code !== 0) {
                return res.status(500).end();
            }

            res.sendFile(filePath, (sendFileError) => {
                if (sendFileError) {
                    debug("error sending file");
                    debug(sendFileError);
                    return res.status(500).end();
                }
                putInCache(fileName);
                debug("file send");
            });
        });
    });
    return;
};
