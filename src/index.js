"use strict";

const debug = require("debug")("index");

import {createWebserver} from "./webserver";
import {createIndexRoute} from "./indexRoute";
import {createPostRoute} from "./postRoute";
import {createThreadRoute} from "./threadRoute";

const start = async () => {
    debug("start");

    const {webserver} = await createWebserver();

    await createPostRoute(webserver);

    await createThreadRoute(webserver);

    await createIndexRoute(webserver);
};

start();

process.on("unhandledRejection", (error) => {
    console.error(error.stack);
    process.exit(1);
});
