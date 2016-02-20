"use strict";

import {getEnv} from "./getEnv";
import {version} from "../package.json";

const IMAGE_QUALITY = getEnv("IMAGE_QUALITY").optional(50).number();
const CACHE_TTL = getEnv("CACHE_TTL").optional(3600000).number();
const WIDTH_POST = getEnv("WIDTH_POST").optional(1024).number();
const WIDTH_THREAD = getEnv("WIDTH_THREAD").optional(1280).number();

export const createIndexRoute = async (webserver) => {
    webserver.use((req, res) => {
        res.status(200).type("text/plain").send(`ROUTES
    /thread/{threadId}
    /thread/{threadId}.png
    /thread/{threadId}/{pageNo}
    /thread/{threadId}/{pageNo}.png
    /post/{postId}
    /post/{postId}.png

FORMAT
    png

QUALITY
    ${IMAGE_QUALITY}

CACHE TTL
    ${CACHE_TTL}

POST WIDTH
    ${WIDTH_POST}

THREAD WIDTH
    ${WIDTH_THREAD}

VERSION
    ${version}

SOURCE
    https://github.com/BreadfishPlusPlus/Screenshot`);
    });
    return;
};
