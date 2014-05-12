/**
 * Cozy Reddit - Improves Reddit usability and highlights new comments (with sync)
 * Author: Yury Zubchenko
 * Copyright (C) 2014  Yury Zubchenko
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * mailto: <yury.zubchenko@gmail.com>
 */
var CozyReddit = CozyReddit || {};

CozyReddit.BrowserContext = (function() {
    var module = {};

    module.init = function() {};
    module.apiUrl = "";

    module.localStorage = {
        get : function (keys, onResponse) {
            chrome.extension.sendRequest(
                {
                    method: 'getLocalStorage',
                    keys: keys
                },
                onResponse
            );
        },

        set : function (key, value) {
            chrome.extension.sendRequest({
                method: 'setLocalStorageItem',
                key: key,
                value : value
            });
        }
    };

    module.getResourceUrl = function(url, callback) {
        callback(chrome.extension.getURL(url));
    };

    module.apiRequest = function(method, args, onComplete) {
        var request = new XMLHttpRequest();
        var url = module.apiUrl + method;
        request.open('POST', url);
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        request.onreadystatechange = function() {
            if (request.readyState == 4) {
                if (typeof onComplete == 'function') {
                    onComplete(JSON.parse(request.responseText));
                }
            }
        };
        request.send(JSON.stringify(args));


    };

    module.requestJson = function(url, callback) {
        var request = new XMLHttpRequest();
        request.open('GET', url, false);
        request.send(null);
        callback(JSON.parse(request.responseText));
    };

    return module;
}());
