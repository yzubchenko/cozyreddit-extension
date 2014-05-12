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

    module.resourceGetMap = {};
    module.jsonRequestMap = {};
    module.apiRequestMap = {};

    module.init = function() {
        self.port.on('onGetLocalStorageItem', function(message) {
            module.localStorage.localStorageGetMap[message.request](message);
            module.localStorage.localStorageGetMap[message.request] = null;
        });

        self.port.on('onGetResourceUrl', function(message) {
            module.resourceGetMap[message.request](message.url);
            module.resourceGetMap[message.request] = null;
        });

        self.port.on('onRequestJSON', function(message) {
            module.jsonRequestMap[message.request](message.json);
            module.jsonRequestMap[message.request] = null;
        });

        self.port.on('onApiResponse', function(message) {
            module.apiRequestMap[message.request](message.response);
            module.apiRequestMap[message.request] = null;
        });
    };

    module.localStorage = {
        localStorageGetMap : {},
        get : function (keys, callback) {
            this.localStorageGetMap[keys] = callback;
            self.port.emit('getLocalStorageItem', {keys: keys});
        },
        set : function (key, value) {
            self.port.emit('setLocalStorageItem', {key: key, value: value});
        }
    };

    module.getResourceUrl = function(url, callback) {
        this.resourceGetMap[url] = callback;
        self.port.emit('getResourceUrl', {url: url});
    };

    module.requestJson = function(url, callback) {
        this.jsonRequestMap[url] = callback;
        self.port.emit('requestJSON', {url: url});
    };

    module.apiRequest = function(method, args, callback) {
        var url = module.apiUrl + method;
        this.apiRequestMap[url] = callback;
        self.port.emit('apiRequest', {url: url, args: args });
    };

    return module;
}());
