phantom.onError = function(msg) {
    stderr.writeLiner(msg);
    phantom.exit(1);
};

var ARGS    = require("system").args;
var page    = require("webpage").create();
var stdout  = require("system").stdout;
var stderr  = require("system").stderr;

var postId = parseInt(ARGS[1], 10);
stdout.writeLine("Post-ID: " + postId);

var url = "https://breadfish.de/index.php?thread/&postID=" + postId;
stdout.writeLine("Post-URL: " + url);

var filePath = ARGS[2];
stdout.writeLine("File-Path: " + filePath);

var userAgent = ARGS[3];
stdout.writeLine("User-Agent: " + userAgent);

var postWidth = ARGS[4];
stdout.writeLine("Width: " + postWidth);

var imageQuality = ARGS[5];
stdout.writeLine("Quality: " + imageQuality + "%");

page.settings.userAgent = userAgent;

page.settings.javascriptEnabled = true;
page.viewportSize = {
    width: postWidth,
    height: 1
};

page.onResourceError = function(resourceError) {
    var id = resourceError.id;
    var url = resourceError.url;
    var errorCode = resourceError.errorCode;
    var errorString = resourceError.errorString;
    stderr.writeLine("Unable to load resource (#" + id + "URL:" + url + ")");
    stderr.writeLine("Error code: " + errorCode + ". Description: " + errorString);
};
page.onResourceError = function(resourceError) {
    var id = resourceError.id;
    var url = resourceError.url;
    var errorCode = resourceError.errorCode;
    var errorString = resourceError.errorString;
    stderr.writeLine("Unable to load resource (#" + id + "URL:" + url + ")");
    stderr.writeLine("Error code: " + errorCode + ". Description: " + errorString);
};
page.onResourceReceived = function (response) {
    var id = response.id;
    var contentType = response.contentType;
    var url = response.url;
    var stage = response.stage;
    stdout.writeLine("Response (#" + id + ", stage " + stage + "): " + contentType + " " + url);
};
page.onResourceRequested = function (requestData, networkRequest) {
    var id = requestData.id;
    var method = requestData.method;
    var url = requestData.url;
    var match = requestData.url.match(/sponsorads\.de|google-analytics\.com|googlesyndication\.com|doubleclick\.net/g);
    if (match !== null) {
        networkRequest.abort();
    } else {
        stdout.writeLine("Request (#" + id + "): " + method + " " + url);
    }
};
page.onResourceTimeout = function (request) {
    var id = request.id;
    var method = request.method;
    var url = request.url;
    var error = {errorCode: request.errorCode, errorString: request.errorString};
    stdout.writeLine("Timeout (#" + id + "): " + method + " " + url + " " + JSON.stringify(error));
};
page.onUrlChanged = function (targetUrl) {
    stdout.writeLine("New URL: " + targetUrl);
};

page.open(url, function () {
    stdout.writeLine("removing all childs except post");
    page.evaluate(function (postId) {
        /* global document*/
        document.querySelector("html").style.background = "transparent";
        document.querySelector("body").style.background = "transparent";
        var post = document.getElementById("post" + postId);
        post.style.margin = "0";
        var elms = document.body.childNodes;
        while (elms.length) {
            document.body.removeChild(elms[0]);
        }
        document.body.appendChild(post);
    }, postId);

    stdout.writeLine("evaluating height");
    var height = page.evaluate(function (postId) {
        return document.getElementById("post" + postId).offsetHeight;
    }, postId);

    stdout.writeLine("evaluating width");
    var width = page.evaluate(function (postId) {
        return document.getElementById("post" + postId).offsetWidth;
    }, postId);

    stdout.writeLine("Crop to: " + width + "x" + height);
    page.clipRect = { top: 0, left: 0, width: width, height: height };

    setTimeout(function () {
        stdout.writeLine("rendering");
        page.render(filePath, {format: "png", quality: imageQuality});
        phantom.exit();
    }, 1);
});


