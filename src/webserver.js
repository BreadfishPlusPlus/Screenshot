"use strict";

const debug = require("debug")("webserver");
const debugRoute = require("debug")("route:default");

import express from "express";
import {getEnv} from "./getEnv";
import Promise from "bluebird";
import {getClientIp} from "request-ip";

export const createWebserver = () => new Promise((resolve, reject) => {
    const webserver = express();

    webserver.set("case sensitive routing", true);
    webserver.set("json spaces", 2);
    webserver.set("trust proxy", true);
    webserver.set("x-powered-by", false);

    const PORT = getEnv("PORT").required().number();

    webserver.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Expose-Headers", "Content-Type");
        debugRoute(`serving reqeust ${req.url} from ${getClientIp(req)}`);
        next();
    });

    const svr = webserver.listen(PORT, "0.0.0.0", (error) => {
        if (error) {
            return reject(error);
        }
        debug(`webserver started: ${JSON.stringify(svr.address())}`);
        return resolve({webserver});
    });
});
