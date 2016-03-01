phantom.onError = function(msg) {
    stderr.writeLiner(msg);
    phantom.exit(1);
};

var ARGS    = require("system").args;
var page    = require("webpage").create();
var stdout  = require("system").stdout;
var stderr  = require("system").stderr;

var threadId = parseInt(ARGS[1], 10);
stdout.writeLine("Thread-ID: " + threadId);

var pageNo = parseInt(ARGS[2], 10);
stdout.writeLine("Page-Nr: " + pageNo);

var url = "https://breadfish.de/index.php?thread/&id=" + threadId + "&pageNo=" + pageNo;
stdout.writeLine("Post-URL: " + url);

var filePath = ARGS[3];
stdout.writeLine("File-Path: " + filePath);

var userAgent = ARGS[4];
stdout.writeLine("User-Agent: " + userAgent);

var threadWidth = ARGS[5];
stdout.writeLine("Width: " + threadWidth);

var imageQuality = ARGS[6];
stdout.writeLine("Quality: " + imageQuality + "%");

page.settings.userAgent = userAgent;

page.settings.javascriptEnabled = true;
page.viewportSize = {
    width: threadWidth,
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
    stdout.writeLine("removing unneccessary elements");
    page.evaluate(function () {
        /* global document */
        var removeElement = function removeElement(selector) {
            Array.prototype.forEach.call(document.querySelectorAll(selector), function (element) {
                element.parentElement.removeChild(element);
            });
        };

        // header
        //removeElement("#pageHeader");

        // breadcrumbs
        //removeElement(".breadcrumbs");

        // footer
        //removeElement("#pageFooter");

        // bg image entfernen
        //document.body.style.background = "none";

        // bg transparent machen
        //document.querySelector("#main").style.margin = "0";
        //document.querySelector("#main").className = "";

        // aussenabstand anpassen
        //document.querySelector("header[data-thread-id]").style.marginTop = "10px";
        //document.querySelector("#content").style.padding = "0 10px 10px 10px";

        // ads
        removeElement(".wcfAdLocation");

        // gast-benachrichtigungen
        removeElement(".userNotice");

        // vorgeschlagene threads
        removeElement("#content > .container");

        // 1px transparente bar top
        removeElement("#top");

        Array.prototype.forEach.call(document.querySelectorAll(".layoutFluid"), function (element) {
            element.classList.remove("layoutFluid");
        });
    });

    setTimeout(function () {
        stdout.writeLine("rendering");
        page.render(filePath, {format: "png", quality: imageQuality});
        phantom.exit();
    }, 1);
});


