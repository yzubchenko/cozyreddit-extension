var pageMod = require("sdk/page-mod");
var data = require("sdk/self").data;
var arrowUpImgUrl = data.url("img/arrow-up.png");
var arrowDownImgUrl = data.url("img/arrow-down.png");

pageMod.PageMod({
    include: "*",
    contentScriptFile: [
        data.url("cozy_reddit_shortcut.js"),
        data.url("cozy_reddit_persistence.js"),
        data.url("cozy_reddit.js")
    ],
    onAttach: function onAttach(worker) {
        var prefs = require('sdk/simple-prefs');

        worker.postMessage([
            [
                arrowUpImgUrl,
                arrowDownImgUrl
            ],
            [
                prefs.prefs['new_comment_background_color'],
                prefs.prefs['new_comment_number_color'],
                prefs.prefs['nav_buttons_enabled']
            ]
        ]);

    }
});