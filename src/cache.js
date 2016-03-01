const debug = require("debug")("cache");

import {join} from "path";
import Promise from "bluebird";
import {getEnv} from "./getEnv";
import Fs from "fs";

const stat = Promise.promisify(Fs.stat);
const unlink = Promise.promisify(Fs.unlink);

const CACHE_TTL = getEnv("CACHE_TTL").optional(3600000).number();

export const removeFromCache = async (fileName) => {
    debug(`deleting ${fileName} from cache`);

    const filePath = join(__dirname, "..", "screenshots", fileName);

    try {
        await unlink(filePath);
        debug(`file ${fileName} deleted`);
        return true;
    } catch (error) {
        debug(`couldn't delete file ${fileName}`);
        debug(error);
        return false;
    }
};

export const putInCache = (fileName) => {
    debug(`putting ${fileName} in cache. will be deleted in ${Math.round(CACHE_TTL / 1000)} seconds.`);
    setTimeout(() => removeFromCache(fileName), CACHE_TTL);
};

export const isCached = async (fileName) => {
    debug(`searching cache for ${fileName}`);

    const filePath = join(__dirname, "..", "screenshots", fileName);

    try {
        const {mtime} = await stat(filePath);

        const now = Date.now();
        const age = now - mtime.getTime();
        debug(`file is ${Math.round(age / 1000)} seconds old`);

        if (age < CACHE_TTL) {
            debug("still guud");
            return true;
        } else {
            return false;
        }
    }
    catch (error) {
        debug("file not found");
        return false;
    }
};
