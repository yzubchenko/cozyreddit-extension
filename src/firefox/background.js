var data = require("sdk/self").data;
var Request = require("sdk/request").Request;
var simplePrefs = require("sdk/simple-prefs");
var simpleStorage = require("sdk/simple-storage").storage;

var onSetLocalStorageItem = function(message) {
    if (message.key) {
        simpleStorage[message.key] = message.value;
    }
};

simplePrefs.on("optionsButton", function() {
    var tabs = require("sdk/tabs");
    var simpleStorage = require("sdk/simple-storage").storage;
    tabs.open(data.url('options/options.html'));
    tabs.on('ready', function(tab) {
        var worker = tab.attach({
            contentScriptFile: [
                data.url('options/jscolor/jscolor.js'),
                data.url('options/options_browser_context.js'),
                data.url('options/options.js')]
        });
        worker.port.on('getLocalStorageItem', function(message) {
            var i, data;
            if (message.keys) {
                data = new Array(message.keys.length);
                for (i = 0; i < message.keys.length; i++) {
                    data[i] = simpleStorage[message.keys[i]];
                }
            }
            worker.port.emit('onGetLocalStorageItem', {
                    request: message.keys, data: data}
            );
        });

        worker.port.on('setLocalStorageItem', onSetLocalStorageItem);
    });
});

var pageMod = require("sdk/page-mod").PageMod;
pageMod({
    include: "*.reddit.com",
    contentScriptFile: [
        data.url("browser_context.js"),
        data.url("shortcut.js"),
        data.url("persistence.js"),
        data.url("widgets.js"),
        data.url("main.js")
    ],
    onAttach: function onAttach(worker) {
        worker.port.on('getLocalStorageItem', function(message) {
            var i, data;
            if (message.keys) {
                data = new Array(message.keys.length);
                for (i = 0; i < message.keys.length; i++) {
                    data[i] = simpleStorage[message.keys[i]];
                }
            }
            worker.port.emit('onGetLocalStorageItem', {
                    request: message.keys, data: data}
            );
        });
        worker.port.on('setLocalStorageItem', onSetLocalStorageItem);
        worker.port.on('getResourceUrl', function(message) {
            if (message.url) {
                worker.port.emit('onGetResourceUrl', {
                        request: message.url,
                        url: data.url(message.url)}
                );
            }
        });

        worker.port.on('requestJSON', function(message){
            if (message.url) {
                Request({
                    url: message.url,
                    onComplete: function (response) {
                        worker.port.emit('onRequestJSON', {
                                request: message.url,
                                json: response.json
                            }
                        );
                    }
                }).get();
            }
        });

        worker.port.on('apiRequest', function(message){
            if (message.url) {
                Request({
                    url: message.url,
                    content: message.args,
                    onComplete: function (response) {
                        worker.port.emit('onApiResponse', {
                                request: message.url,
                                response: response.json
                            }
                        );
                    }
                }).post();
            }
        });
    }
});




