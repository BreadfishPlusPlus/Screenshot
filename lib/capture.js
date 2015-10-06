/* global phantom, document */
"use strict";

var ARGS        = require("system").args;
var ENV         = require("system").env;
var webpage     = require("webpage");


var url = ARGS[1];
var fileName = ARGS[2];
var postId = ARGS.length > 3 ? ARGS[3] : null;


var page = webpage.create();
page.settings.userAgent = ENV.USER_AGENT;
page.settings.javascriptEnabled = true;
page.viewportSize = {
    width: postId ? ENV.WIDTH_POST : ENV.WIDTH_THREAD,
    height: 1
};


page.open(url, function() {
    page.evaluate(function() {
        var removeElement = function removeElement(selector) {
            Array.prototype.forEach.call(document.querySelectorAll(selector), function (element) {
                if (!element.id.length) {
                    element.parentElement.removeChild(element);
                }
            });
        };
        /* Werbung unter dem Menü entfernen */
        removeElement("#aswift_0_expand");

        /* Popup Werbung entfernen */
        removeElement(".wcfAdLocation");
    });
    if (postId) {
        page.evaluate(function(postId) {
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
    }
    setTimeout(function () {
        page.render(fileName);
        phantom.exit();
    }, 1);
});
